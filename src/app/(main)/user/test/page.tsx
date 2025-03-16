import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const Page = async () => {
  return (
    <div className="flex flex-1 min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Page;
