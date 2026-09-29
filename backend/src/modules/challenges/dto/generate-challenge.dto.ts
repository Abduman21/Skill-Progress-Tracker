import { IsMongoId } from "class-validator";

export class GenerateChallengeDto {
  @IsMongoId()
  chapterId: string;
}
