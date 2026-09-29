import { Types } from "mongoose";
import { StreaksService } from "./streaks.service";
import { NotificationsService } from "../notifications/notifications.service";
import { mongoClient } from "../../auth/auth.service";
jest.mock("../../auth/auth.service.js", () => ({
  mongoClient: { db: jest.fn() },
}));

describe("UTC streaks", () => {
  let service: StreaksService;
  let collection: {
    findOne: jest.Mock;
    updateOne: jest.Mock;
    updateMany: jest.Mock;
    find: jest.Mock;
  };
  const userId = new Types.ObjectId().toString();
  const notifications = { sendStreakReminder: jest.fn() };
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-09-28T00:00:01Z"));
    collection = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
      updateMany: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      find: jest.fn(),
    };
    (mongoClient.db as jest.Mock).mockReturnValue({
      collection: () => collection,
    });
    service = new StreaksService(
      notifications as unknown as NotificationsService,
    );
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it.each([
    ["", 0, 1],
    ["2026-09-27", 5, 6],
    ["2026-09-25", 9, 1],
    ["2026-09-28", 0, 1],
  ])(
    "handles prior activity %s",
    async (lastActiveDate, learningStreak, expected) => {
      collection.findOne.mockResolvedValue({ lastActiveDate, learningStreak });
      await service.updateUserStreak(userId);
      expect(collection.findOne).toHaveBeenCalledWith({
        _id: new Types.ObjectId(userId),
      });
      expect(collection.updateOne).toHaveBeenCalledWith(
        { _id: new Types.ObjectId(userId), lastActiveDate },
        { $set: { learningStreak: expected, lastActiveDate: "2026-09-28" } },
      );
    },
  );
  it("does not increment twice on the same UTC day", async () => {
    collection.findOne.mockResolvedValue({
      lastActiveDate: "2026-09-28",
      learningStreak: 3,
    });
    await service.updateUserStreak(userId);
    expect(collection.updateOne).not.toHaveBeenCalled();
  });
  it("resets only activity older than yesterday, retaining today's streaks", async () => {
    await service.handleStreakResets();
    expect(collection.updateMany).toHaveBeenCalledWith(
      { lastActiveDate: { $lt: "2026-09-27" }, learningStreak: { $gt: 0 } },
      { $set: { learningStreak: 0 } },
    );
  });
});
