jest.mock("../../auth/auth.service.js", () => ({ mongoClient: {} }));
import { ForbiddenException } from "@nestjs/common";
import { AssessmentsService } from "./assessments.service";
describe("assessment ownership and answers", () => {
  const chapter = { findOne: jest.fn() };
  const assessment = { findOne: jest.fn(), findById: jest.fn() };
  const service = new AssessmentsService(
    assessment as any,
    {} as any,
    chapter as any,
    {} as any,
  );
  beforeEach(() => jest.clearAllMocks());
  it("checks chapter ownership before accessing answers or writing an attempt", async () => {
    chapter.findOne.mockRejectedValue(new ForbiddenException());
    await expect(
      service.submitAssessment("bob", {
        chapterId: "chapter",
        assessmentId: "quiz",
        answers: [0, 1, 2],
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(assessment.findById).not.toHaveBeenCalled();
  });
  it("does not send correct answers or explanations before submission", async () => {
    chapter.findOne.mockResolvedValue({ _id: "chapter" });
    assessment.findOne.mockResolvedValue({
      _id: "quiz",
      chapterId: "chapter",
      questions: [
        {
          question: "Q",
          options: ["A", "B", "C", "D"],
          answer: 2,
          explanation: "secret answer",
        },
      ],
    });
    const quiz = await service.generateAssessment("alice", {
      chapterId: "chapter",
    });
    expect(quiz.questions).toEqual([
      { question: "Q", options: ["A", "B", "C", "D"] },
    ]);
    expect(JSON.stringify(quiz)).not.toContain("secret answer");
  });
});
