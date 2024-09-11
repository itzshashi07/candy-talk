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
import { ShoutoutSchema, ShoutoutTitles } from "@/lib/validations";
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
import { ShoutoutTitlesArray } from "@/constants/titles";
import { createShoutout } from "@/lib/actions/shoutout.action";
import { toast } from "@/hooks/use-toast";
import { searchUsers } from "@/lib/actions/general.action";
import Image from "next/image";

interface Props {
  mongoUserId: string;
  type?: string;
}

interface SearchUser {
  _id: string;
  username: string;
  picture?: string;
}

const Shoutout = ({ mongoUserId, type }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof ShoutoutSchema>>({
    resolver: zodResolver(ShoutoutSchema),
    defaultValues: {
      title: ShoutoutTitles.default,
      receiverName: "",
      anonymity: "false",
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

  async function onSubmit(values: z.infer<typeof ShoutoutSchema>) {
    setIsSubmitting(true);
    try {
      const isAnonymous = values.anonymity === "true";
      const result = await createShoutout({
        title: values.title,
        author: JSON.parse(mongoUserId),
        receiverName: values.receiverName,
        isAnonymous: isAnonymous,
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
          title: `Wow! You created a shoutout successfully! 🪄`,
          variant: "default",
        });
      }

      router.push("/shoutouts");
    } catch (error) {
      console.error(error);
      toast({
        title: `Alas! Something bad happened 🙄`,
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
          name="receiverName"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col relative">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Shoutout To <span className="text-primary-500 ml-2">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
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
              <FormMessage className="text-red-600" />
              {searchResults.length > 0 && (
                <div className="absolute shadow-md top-full z-10 mt-1 w-full bg-light-800 dark:bg-dark-400">
                  <div className="flex flex-col">
                    {searchResults.map((user) => (
                      <div
                        key={user?._id}
                        className="flex w-full cursor-pointer bg-light-700/50 items-start gap-3 px-5 py-2.5 hover:bg-light-700 dark:bg-dark-500/50 hover:dark:bg-dark-500"
                        onClick={() => {
                          form.setValue("receiverName", user.username);
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Select Shoutout Title
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Select
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
                      {ShoutoutTitlesArray.map((title) => (
                        <SelectItem key={title.key} value={title.value}>
                          {title.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Choose a title for the person.
              </FormDescription>
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
                Do you want to display your name on the shoutout
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
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <Button
          className="primary-gradient w-fit !text-light-900 mt-1"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Creating..."}</>
          ) : (
            <> {type === "Edit" ? "Edit Post" : "Create Shoutout"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Shoutout;
