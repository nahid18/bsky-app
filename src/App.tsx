import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EyeSlashFilledIcon } from "./components/EyeSlashFilledIcon";
import { EyeFilledIcon } from "./components/EyeFilledIcon";
import { Button, Link, Textarea } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import NavBar from "./components/NavBar";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import React from "react";
import * as z from "zod";

const schema = z.object({
  handle: z.string().min(2, { message: "Handle is required!" }),
  password: z.string().min(2, { message: "Password is required!" }),
  follow: z.string().min(2, { message: "Accounts to follow are required!" }),
});

function App() {
  const [isVisible, setIsVisible] = React.useState(true);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      handle: localStorage.getItem("handle") || "",
      password: localStorage.getItem("password") || "",
      follow: "",
    },
  });

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["count"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_UPSTASH_REDIS_REST_URL}/get/count`,
        {
          headers: {
            Authorization:
              "Bearer " + import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN,
          },
        }
      );
      return await res.json();
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof schema>) => {
      const response = fetch("https://bsky-migrate.onrender.com/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["count"]);
      toast.success("Followed Successfully");
    },
    onError: () => {
      queryClient.invalidateQueries(["count"]);
      toast.error("Something went wrong");
    },
  });

  const handleFollow: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    const handle = data.handle.replace(/\s/g, "").replace(/\n/g, "");
    const password = data.password.replace(/\s/g, "").replace(/\n/g, "");
    const follow = data.follow.replace(/\s/g, "").replace(/\n/g, "");

    localStorage.setItem("handle", handle);
    localStorage.setItem("password", password);
    mutate({ handle, password, follow });
  };

  return (
    <>
      <NavBar />
      <form
        onSubmit={handleSubmit(handleFollow)}
        className="grid place-items-center grid-cols-1 gap-3 mt-6"
      >
        <div className="font-bold text-2xl">bsky follow</div>
        <div className="text-sm bg-blue-100 border rounded-md text-blue-700 border-blue-700 max-w-sm p-3 leading-6">
          <div>Enter MYHANDLE instead of @MYHANDLE.social.app</div>
        </div>
        <div className="text-sm bg-yellow-100 border rounded-md text-yellow-700 border-yellow-700 max-w-sm p-3 leading-6 mb-4">
          <div>No personal information is stored</div>
        </div>
        <Input
          type="text"
          variant="bordered"
          size="lg"
          label="handle"
          labelPlacement="outside"
          className="max-w-sm"
          placeholder="Enter your bsky handle, example: abdnahid"
          {...register("handle")}
        />
        <span className="max-w-sm text-red-500">{errors.handle?.message}</span>
        <Input
          label="password"
          variant="bordered"
          size="lg"
          labelPlacement="outside"
          placeholder="Enter your bsky password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-sm"
          {...register("password")}
        />
        <span className="max-w-sm text-red-500">
          {errors.password?.message}
        </span>
        <Textarea
          label="Accounts to follow"
          variant="bordered"
          size="lg"
          labelPlacement="outside"
          placeholder="Enter the handles to follow, separated by commas; example: stephaniehicks, anshulkundaje"
          className="max-w-sm"
          {...register("follow")}
        />
        <span className="max-w-sm text-red-500">{errors.follow?.message}</span>

        <div className="flex flex-col gap-[8px]">
          {isLoading ? (
            <Spinner color="primary" />
          ) : (
            <>
              <Button
                className="max-w-sm mt-2"
                size="lg"
                color="primary"
                type="submit"
              >
                Follow on bsky
              </Button>
              <Button
                className="max-w-sm"
                size="lg"
                color="default"
                type="reset"
                onClick={() => {
                  localStorage.removeItem("handle");
                  localStorage.removeItem("password");
                  reset();
                }}
              >
                Clear Form
              </Button>
            </>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-4 justify-center items-center">
          <div className="font-medium">Accounts Followed So Far</div>
          <div className="font-bold text-4xl text-pink-600">
            <CountUp start={0} end={parseInt(data?.result)} delay={0}>
              {({ countUpRef }) => (
                <div>
                  <span ref={countUpRef} />
                </div>
              )}
            </CountUp>
          </div>
        </div>
      </form>

      <footer className="mt-4 flex justify-center items-center gap-2 p-8">
        Developed by
        <Link
          href="https://twitter.com/abdnahid_"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          <span>@abdnahid_</span>
        </Link>
      </footer>
    </>
  );
}

export default App;
