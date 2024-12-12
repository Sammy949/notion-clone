"use client";

import { useMemo, use } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { useLoading } from "@/context/LoadingContext";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default function DocumentIdPage(props: DocumentIdPageProps) {
  const params = use(props.params);
  const { setLoading } = useLoading();

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    console.log("Updating content:", content);
    setLoading(true);

    update({ id: params.documentId as Id<"documents">, content })
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Failed to update content:", error);
      });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor
          onChange={onChange}
          editable={true}
          initialContent={document.content}
        />
      </div>
    </div>
  );
}
