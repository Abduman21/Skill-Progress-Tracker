import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AssessmentsController } from "../src/modules/assessments/assessments.controller";
import { AssessmentsService } from "../src/modules/assessments/assessments.service";
import { AuthGuard } from "../src/common/guards/auth.guard";
jest.mock("../src/auth/auth.service.js", () => ({ auth: {} }));
jest.mock("better-auth/node", () => ({ fromNodeHeaders: jest.fn() }));
describe("assessment HTTP validation (isolated dependencies)", () => {
  let app: INestApplication;
  const submitAssessment = jest.fn().mockResolvedValue({ score: 100 });
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AssessmentsController],
      providers: [
        { provide: AssessmentsService, useValue: { submitAssessment } },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (ctx) => {
          ctx.switchToHttp().getRequest().user = { id: "owner" };
          return true;
        },
      })
      .compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });
  afterAll(() => app.close());
  it.each([
    [0, 1, 4],
    [0, 1, 0.5],
    [-1, 0, 1],
  ])("rejects invalid answer indices %j", async (...answers) => {
    await request(app.getHttpServer())
      .post("/assessments/submit")
      .send({
        chapterId: "507f1f77bcf86cd799439011",
        assessmentId: "507f1f77bcf86cd799439012",
        answers,
      })
      .expect(400);
  });
  it("passes valid answers and the authenticated owner to the service", async () => {
    const body = {
      chapterId: "507f1f77bcf86cd799439011",
      assessmentId: "507f1f77bcf86cd799439012",
      answers: [0, 1, 2],
    };
    await request(app.getHttpServer())
      .post("/assessments/submit")
      .send(body)
      .expect(201);
    expect(submitAssessment).toHaveBeenCalledWith("owner", body);
  });
});
