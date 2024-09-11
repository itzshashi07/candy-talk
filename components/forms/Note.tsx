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
import { NoteSchema, NoteType } from "@/lib/validations";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createNote, editNote } from "@/lib/actions/note.action";
import { toast } from "@/hooks/use-toast";
import { searchUsers } from "@/lib/actions/general.action";
import Image from "next/image";

interface Props {
  mongoUserId: string;
  type?: string;
  noteDetails?: string;
}

interface SearchUser {
  _id: string;
  username: string;
  picture?: string;
}

const Note = ({ mongoUserId, type, noteDetails }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  // Parsing question details for edit question usage:
  const parsedNoteDetails = noteDetails
    ? JSON.parse(noteDetails || "")
    : undefined;

  const form = useForm<z.infer<typeof NoteSchema>>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      title: parsedNoteDetails?.title,
      content: parsedNoteDetails?.content,
      anonymity: "true",
      noteFor: "",
      noteType: NoteType.opinion,
    },
  });

  let debounceTimeout: any;

  const handleSearchChange = (query: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(async () => {
      if (query) {
        const users = await searchUsers({ query });
        setSearchResults(users);
      } else {
        setSearchResults([]);
      }
    }, 1000);
  };

  async function onSubmit(values: z.infer<typeof NoteSchema>) {
    setIsSubmitting(true);
    try {
      const isAnonymous = values.anonymity === "true";
      if (type === "Edit") {
        await editNote({
          noteId: parsedNoteDetails._id,
          title: values.title,
          content: values.content,
          isAnonymous: isAnonymous,
          path: pathname,
          // noteType: values.noteType,
        });
        toast({
          title: `Changes saved`,
          variant: "default",
        });
        router.push(`/notes/${parsedNoteDetails._id}`);
      } else {
        const result = await createNote({
          title: values.title,
          content: values.content,
          author: JSON.parse(mongoUserId),
          noteFor: values.noteFor,
          isAnonymous: isAnonymous,
          noteType: values.noteType,
          path: pathname,
        });
        if (result.error) {
          toast({
            title: result.error,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        } else {
          toast({
            title: `Wow! you created a note successfully! 🥳`,
            variant: "default",
          });
          if (values.noteType === "confession") {
            router.push("/anonymous/confessions");
          } else {
            router.push("/anonymous");
          }
        }
      }
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
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Express your thought, feelings.
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Textarea
                  {...field}
                  spellCheck={false}
                  className="no-scrollbar h-[20vh] resize-none mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be sure to express yourself in a respectful and considerate
                manner. Avoid using inappropriate or offensive language, and
                ensure that your opinions or confessions are relevant and
                genuine.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        {/* Adding username option */}
        {type !== "Edit" && (
          <FormField
            control={form.control}
            name="noteFor"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col relative">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Creating For <span className="text-red-400">(Optional)</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    disabled={type === "Edit"}
                    {...field}
                    type="search"
                    placeholder="Enter username"
                    spellCheck={false}
                    className="mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    onChange={(ev) => {
                      field.onChange(ev);
                      setSearchQuery(ev.target.value);
                      handleSearchChange(ev.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Mention the username of the person you're confessing or
                  dedicating this note to. Rest assured, their name will not be
                  displayed publicly. Only the mentioned person will know this
                  note is for them.
                </FormDescription>
                <FormMessage className="text-red-600" />
                {searchResults.length > 0 && (
                  <div className="absolute shadow-md top-full z-10 mt-1 w-full bg-light-800 dark:bg-dark-400">
                    <div className="flex flex-col">
                      {searchResults.map((user) => (
                        <div
                          key={user?._id}
                          className="flex w-full cursor-pointer bg-light-700/50 items-start gap-3 px-5 py-2.5 hover:bg-light-700 dark:bg-dark-500/50 hover:dark:bg-dark-500"
                          onClick={() => {
                            form.setValue("noteFor", user.username);
                            setSearchQuery(user?.username);
                            setSearchResults([]);
                          }}
                        >
                          <div className="flex gap-2 items-center flex-row-reverse">
                            <p className="paragraph-regular text-dark200_light800 line-clamp-1">
                              {user?.username}
                            </p>
                            {user.picture && (
                              <Image
                                alt="User"
                                width={28}
                                height={28}
                                src={user.picture}
                                className="object-contain mt-1 rounded-full"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />
        )}
        {/* Adding username option */}
        <FormField
          control={form.control}
          name="noteType"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Note type
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Select
                  disabled={type === "Edit"}
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger className="body-regular light-border background-light800_dark300 text-dark500_light700">
                    <div className="line-clamp-1 flex-1 text-left">
                      <SelectValue placeholder="Select" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
                    <SelectGroup>
                      <SelectItem value={NoteType.confession}>
                        A Confession
                      </SelectItem>
                      <SelectItem value={NoteType.opinion}>
                        My Opinion
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {type === "Edit" && (
                <p className="body-medium text-yellow-500">
                  You cannot change Note type
                </p>
              )}
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anonymity"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                In-case you want to display your name on the post
              </FormLabel>
              <FormControl className="mt-3.5">
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger className="body-regular light-border background-light800_dark300 text-dark500_light700 px-3 py-2.5">
                    <div className="line-clamp-1 flex-1 text-left">
                      <SelectValue placeholder="Select" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
                    <SelectGroup>
                      <SelectItem value="true">
                        Do not display my name
                      </SelectItem>
                      <SelectItem value="false">Display my name</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                If you choose "Do not display my name", we won't display your
                name publicly or to the person you mentioned above (If
                mentioned). So no need to worry.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        <Button
          className="primary-gradient w-fit !text-light-900 mt-10"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <> {type === "Edit" ? "Edit Post" : "Create Post"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Note;
