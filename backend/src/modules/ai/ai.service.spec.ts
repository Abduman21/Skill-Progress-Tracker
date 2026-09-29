jest.mock("../../auth/auth.service.js", () => ({ mongoClient: {} }));
import { NotFoundException } from "@nestjs/common";
import { AiService } from "./ai.service";
describe("roadmap job access", () => {
  const queue = { getJob: jest.fn() };
  const service = new AiService(
    {} as any,
    queue as any,
    {} as any,
    {} as any,
    {} as any,
  );
  it("hides missing jobs and another user's jobs", async () => {
    queue.getJob.mockResolvedValue(null);
    await expect(service.getJobStatus("1", "alice")).rejects.toBeInstanceOf(
      NotFoundException,
    );
    queue.getJob.mockResolvedValue({ data: { userId: "bob" } });
    await expect(service.getJobStatus("1", "alice")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
  it("returns only the owner's result", async () => {
    queue.getJob.mockResolvedValue({
      data: { userId: "alice" },
      getState: async () => "completed",
      progress: 100,
      returnvalue: { pathId: "path" },
    });
    await expect(service.getJobStatus("1", "alice")).resolves.toMatchObject({
      status: "completed",
      result: { pathId: "path" },
    });
  });
  it("does not expose internal queue error details", async () => {
    queue.getJob.mockResolvedValue({
      data: { userId: "alice" },
      getState: async () => "failed",
      failedReason: "mongodb://private-host/secret",
    });
    expect(
      JSON.stringify(await service.getJobStatus("1", "alice")),
    ).not.toContain("private-host");
  });
});
