"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Check, MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./Title";
import Banner from "./Banner";
import { Menu } from "./Menu";
import Publish from "./Publish";
import { Spinner } from "@/components/spinner";
import { useLoading } from "@/context/LoadingContext";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();
  const { loading } = useLoading();
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined)
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );

  if (document === null) return null;

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-2">
            <Title initialData={document} />
            {loading ? (
              <div className="group flex items-center justify-center gap-x-2">
                <Spinner />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300">
                  <p className="text-sm text-foreground-muted">
                    Saving Changes
                  </p>
                </div>
              </div>
            ) : (
              <div className="group flex items-center justify-center gap-x-2">
                <Check className="h-5 w-5 p-1 bg-green-600 rounded-full text-white font-bold" />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300">
                  <p className="text-sm text-foreground-muted">Note Saved!</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};

export default Navbar;
