import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';

export class CreatePostDto {
	@MinLength(5)
	@MaxLength(32)
	title: string;

	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	categoryIds: number[];
}
