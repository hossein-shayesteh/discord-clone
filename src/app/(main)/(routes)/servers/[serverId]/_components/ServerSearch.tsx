"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/src/components/ui/command";

interface ServerSearchProps {
  data: {
    label: string;
    type: "members" | "channel";
    data: {
      id: string;
      name: string;
      icon: React.ReactNode;
    }[];
  }[];
}

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  // Open search on key down
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Function to handle click on command items
  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "members" | "channel";
  }) => {
    if (type === "channel")
      router.push(`/servers/${params.serverId}/channels/${id}`);
    if (type === "members")
      router.push(`/servers/${params.serverId}/conversation/${id}`);

    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          "group flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
        }
      >
        <Search className={"h-4 w-4 text-zinc-500 dark:text-zinc-400"} />
        <p
          className={
            "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300"
          }
        >
          search
        </p>
        <kbd
          className={
            "pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
          }
        >
          <span className={"text-xs"}>ctrl</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data.map(({ data, type, label }) => {
            if (!data.length) return null;

            return (
              <React.Fragment key={label}>
                <CommandGroup heading={label}>
                  {data.map(({ icon, name, id }) => (
                    <CommandItem
                      key={id}
                      onSelect={() => onClick({ id, type })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator key={`${label}-separator`} />
              </React.Fragment>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
