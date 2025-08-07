"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SettingComboboxProps {
  value: string;
  values: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  allowCustom?: boolean;
  isInvalid?: boolean;
}

const SettingCombobox: React.FC<SettingComboboxProps> = ({
  value,
  values,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  allowCustom = true,
  isInvalid = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Filter values based on search
  const filteredValues = values.filter((val) =>
    val.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Show custom option if search value doesn't exactly match any existing values
  const showCustomOption =
    allowCustom &&
    searchValue &&
    !values.some((val) => val.toLowerCase() === searchValue.toLowerCase());

  useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  return (
    <div className="flex flex-1 items-center justify-start gap-1 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left",
              isInvalid && "border-warning ring-warning/20 border"
            )}
          >
            <span className="truncate">{value || placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] min-w-[8rem] max-w-[calc(100vw-2rem)] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9"
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              {!filteredValues.length && !showCustomOption && (
                <CommandEmpty>{emptyText}</CommandEmpty>
              )}
              {filteredValues.length > 0 && (
                <CommandGroup>
                  {filteredValues.map((val) => (
                    <CommandItem
                      key={val}
                      value={val}
                      onSelect={() => {
                        onChange(val === value ? "" : val);
                        setOpen(false);
                      }}
                    >
                      {val}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === val ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {showCustomOption && (
                <CommandGroup>
                  <CommandItem
                    value={`create-${searchValue}`}
                    onSelect={() => {
                      onChange(searchValue);
                      setOpen(false);
                      setSearchValue("");
                    }}
                    className="text-muted-foreground"
                  >
                    Create &quot;{searchValue}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SettingCombobox;
