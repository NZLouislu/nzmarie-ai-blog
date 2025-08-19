import { Badge } from "@radix-ui/themes";

export default function Tag({ name }: { name: string }) {
  return (
    <Badge variant="soft" radius="full">
      {name}
    </Badge>
  );
}
