jest.mock("../../auth/auth.service.js", () => ({ mongoClient: {} }));
import { RoadmapProcessor } from "./roadmap.processor";

describe("roadmap validation and cleanup", () => {
  const ai = { generateText: jest.fn() };
  const resources = { discoverForChapters: jest.fn() };
  const paths = { create: jest.fn(), remove: jest.fn() };
  const chapters = { create: jest.fn() };
  const processor = new RoadmapProcessor(
    ai as any,
    resources as any,
    paths as any,
    chapters as any,
  );
  const job = {
    id: "job",
    data: { userId: "alice", topic: "TypeScript", skillLevel: "beginner" },
    updateProgress: jest.fn().mockResolvedValue(undefined),
  };
  const roadmap = {
    pathName: "TypeScript",
    description: "Learn TypeScript",
    chapters: [{ title: "Types", estimatedMinutes: 60 }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    paths.create.mockResolvedValue({ _id: "path", name: "TypeScript" });
    paths.remove.mockResolvedValue(undefined);
    chapters.create.mockResolvedValue({ _id: "chapter", title: "Types" });
    resources.discoverForChapters.mockResolvedValue(undefined);
  });

  it.each(["not JSON", JSON.stringify({ ...roadmap, chapters: [] })])(
    "rejects invalid AI output before saving records: %s",
    async (response) => {
      ai.generateText.mockResolvedValue(response);
      await expect(processor.process(job as any)).rejects.toThrow(
        "invalid roadmap structure",
      );
      expect(paths.create).not.toHaveBeenCalled();
      expect(chapters.create).not.toHaveBeenCalled();
    },
  );

  it("accepts fenced JSON and schedules resources after saving chapters", async () => {
    ai.generateText.mockResolvedValue(
      "```json\n" + JSON.stringify(roadmap) + "\n```",
    );
    await expect(processor.process(job as any)).resolves.toEqual({
      pathId: "path",
      name: "TypeScript",
    });
    expect(resources.discoverForChapters).toHaveBeenCalledWith(
      [{ id: "chapter", title: "Types" }],
      "alice",
      "TypeScript",
      "beginner",
    );
  });

  it("removes the partial path if chapter persistence fails", async () => {
    ai.generateText.mockResolvedValue(JSON.stringify(roadmap));
    chapters.create.mockRejectedValueOnce(new Error("Save failed"));
    await expect(processor.process(job as any)).rejects.toThrow("Save failed");
    expect(paths.remove).toHaveBeenCalledWith("path", "alice");
    expect(resources.discoverForChapters).not.toHaveBeenCalled();
  });
});
