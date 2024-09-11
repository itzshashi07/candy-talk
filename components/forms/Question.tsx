"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema } from "@/lib/validations";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useState } from "react";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useRouter, usePathname } from "next/navigation";
import { ITag } from "@/database/tag.model";
import { toast } from "@/hooks/use-toast";
interface Props {
  mongoUserId: string;
  type?: string;
  questionDetails?: string;
}

const Question = ({ mongoUserId, type, questionDetails }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Parsing question details for edit question usage:
  const parsedQuestionDetails = questionDetails
    ? JSON.parse(questionDetails || "")
    : undefined;
  const groupedTags = parsedQuestionDetails?.tags.map((tag: ITag) => tag.name);

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || "",
      explaination: parsedQuestionDetails?.content || "",
      tags: groupedTags || [],
    },
  });

  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true);
    try {
      if (type === "Edit") {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explaination,
          path: pathname,
        });
        toast({
          title: `Changes saved`,
          variant: "default",
        });
        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explaination,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        toast({
          title: `Wow! you asked a question successfully! 🥳`,
          variant: "default",
        });
        router.push("/");
      }
      // Navigate to home page
    } catch (error) {
      console.error(error);
      toast({
        title: `Something bad happened 🙄`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (event.key === "Enter" && field.name === "tags") {
      event.preventDefault();
      const tagInput = event.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag names should not exceed 15 characters.",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Title
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  {...field}
                  spellCheck={false}
                  className="mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and relevant with the title.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explaination"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Explanation
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Textarea
                  {...field}
                  spellCheck={false}
                  className=" h-[15vh] no-scrollbar resize-none mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Write down the actual question or query you want to ask.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    placeholder="eg: EXAMS, FAREWELL, NOTES, etc..."
                    disabled={type === "Edit"}
                    className="mt-2 no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    onKeyDown={(event) => handleInputKeyDown(event, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light700_dark300 text-dark400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() =>
                            type !== "Edit"
                              ? handleTagRemove(tag, field)
                              : () => {}
                          }
                        >
                          {tag}
                          {type !== "Edit" && (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="close"
                              width={16}
                              height={16}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {type === "Edit" && (
                    <p className="body-medium text-yellow-500">
                      You cannot edit tags
                    </p>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags / keywords that describe what your question is
                all about. Press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <Button
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <> {type === "Edit" ? "Edit Question" : "Ask Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
