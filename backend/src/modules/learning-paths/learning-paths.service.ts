import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import type { Connection, Model } from "mongoose";
import { LearningPath } from "./schemas/learning-path.schema.js";
import { CreateLearningPathDto } from "./dto/create-learning-path.dto.js";
import { UpdateLearningPathDto } from "./dto/update-learning-path.dto.js";

@Injectable()
export class LearningPathsService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(LearningPath.name)
    private learningPathModel: Model<LearningPath>,
  ) {}

  async create(userId: string, createDto: CreateLearningPathDto) {
    const learningPath = new this.learningPathModel({
      ...createDto,
      userId,
      progress: 0,
    });

    return learningPath.save();
  }

  async findAll(userId: string) {
    const learningPaths = await this.learningPathModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    return learningPaths;
  }

  async findOne(id: string, userId: string) {
    const learningPath = await this.learningPathModel.findById(id).exec();

    if (!learningPath) {
      throw new NotFoundException("Learning path not found");
    }

    if (learningPath.userId.toString() !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return learningPath;
  }

  async update(id: string, userId: string, updateDto: UpdateLearningPathDto) {
    const learningPath = await this.findOne(id, userId);

    Object.assign(learningPath, updateDto);
    return learningPath.save();
  }

  async remove(id: string, userId: string) {
    const learningPath = await this.findOne(id, userId);
    const chapters = await this.connection
      .collection("chapters")
      .find({ learningPathId: learningPath._id })
      .project({ _id: 1 })
      .toArray();
    const chapterIds = chapters.map((chapter) => chapter._id);
    for (const name of ["assessments", "quizattempts", "challenges"]) {
      await this.connection
        .collection(name)
        .deleteMany({ chapterId: { $in: chapterIds } });
    }
    await this.connection
      .collection("chapters")
      .deleteMany({ learningPathId: learningPath._id });
    await learningPath.deleteOne();

    return { message: "Learning path deleted successfully" };
  }

  async updateProgress(learningPathId: string, progress: number) {
    return this.learningPathModel
      .findByIdAndUpdate(learningPathId, { progress }, { new: true })
      .exec();
  }
}
