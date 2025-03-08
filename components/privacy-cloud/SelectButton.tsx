import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { ChevronDown } from "lucide-react";

interface SelectButtonProps {
  children: string;
}

export default function SelectButton({ children }: SelectButtonProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="capitalize"
          color={"default"}
          endContent={<ChevronDown size={17} />}
          size={"sm"}
          variant={"bordered"}
        >
          {children}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dropdown Variants"
        color={"default"}
        variant={"bordered"}
      >
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
