import { IsMongoId } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetRecommendationDto {
  @ApiProperty({
    description: "The ID of the learning path to get a recommendation for",
    example: "699034c040ece1e038c74d10",
  })
  @IsMongoId()
  learningPathId: string;
}
