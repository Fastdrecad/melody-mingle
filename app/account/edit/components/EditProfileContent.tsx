"use client";

import Button from "@/components/Button";
import { useUser } from "@/hooks/useUser";
import {
  useSupabaseClient,
  useUser as useSupaUser
} from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaUser } from "react-icons/fa";

const EditProfileContent = () => {
  const router = useRouter();
  const { userDetails, isLoading, user } = useUser();
  const supabaseUser = useSupaUser();
  const supabaseClient = useSupabaseClient();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      full_name: "",
      avatar_url: ""
    }
  });

  useEffect(() => {
    if (userDetails) {
      setValue("full_name", userDetails.full_name || "");
      setAvatarUrl(userDetails.avatar_url || "");
    }
  }, [userDetails, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large. Maximum size is 5MB");
        return;
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        toast.error("Unsupported file type. Use JPG, PNG or GIF");
        return;
      }

      if (avatarUrl) {
        const oldFilePath = avatarUrl.split("/").pop();

        if (oldFilePath) {
          const { error: removeError } = await supabaseClient.storage
            .from("avatars")
            .remove([oldFilePath]);
        }
      }

      const fileName = `avatar-${user?.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError, data: uploadData } =
        await supabaseClient.storage.from("avatars").upload(fileName, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl }
      } = supabaseClient.storage.from("avatars").getPublicUrl(fileName);

      setAvatarUrl(publicUrl);

      const { error: updateError, data: updateData } = await supabaseClient
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      toast.success("Avatar updated successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.message || "Error uploading avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      const { error } = await supabaseClient
        .from("users")
        .update({
          full_name: values.full_name,
          avatar_url: avatarUrl
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Profile updated!");
      router.push("/account");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="mb-7 px-6">
      <div className="flex flex-col gap-y-6">
        <h1 className="text-white text-2xl font-semibold">Edit Profile</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <div className="flex items-center gap-x-4">
            <div className="relative h-20 w-20">
              <div className="relative h-full w-full rounded-full overflow-hidden bg-neutral-700">
                {avatarUrl ? (
                  <Image
                    fill
                    src={avatarUrl}
                    alt="Avatar"
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 80px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <FaUser size={40} className="text-neutral-400" />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-white">Profile Picture</h3>
              <p className="text-sm text-neutral-400">
                Click to upload new avatar
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-1">
            <label className="text-white">Full Name</label>
            <input
              {...register("full_name")}
              className="bg-neutral-700 border border-transparent focus:border-white transition p-2 rounded-md text-white"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label className="text-white">Email</label>
            <input
              type="email"
              disabled
              value={supabaseUser?.email || ""}
              className="bg-neutral-700 border border-transparent p-2 rounded-md text-neutral-400"
            />
          </div>

          <Button type="submit" className="mt-4" disabled={isUploading}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileContent;
