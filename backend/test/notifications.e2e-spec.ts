import { ConfigService } from "@nestjs/config";
import { NotificationsService } from "../src/modules/notifications/notifications.service";
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({ sendMail: jest.fn() })),
}));
describe("notification rendering (no email delivery)", () => {
  it("escapes user-supplied markup and links to the configured frontend", async () => {
    const service = new NotificationsService(
      new ConfigService({ FRONTEND_URL: "https://app.example.com" }),
    );
    const send = jest.spyOn(service, "sendEmail").mockResolvedValue(undefined);
    await service.sendStreakReminder("recipient@example.com", "<img src=x>", 3);
    expect(send).toHaveBeenCalledWith(
      "recipient@example.com",
      expect.stringContaining("3-day"),
      expect.stringContaining("&lt;img src=x&gt;"),
    );
    expect(send.mock.calls[0][2]).toContain("https://app.example.com");
  });
});
