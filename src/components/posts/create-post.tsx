import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import TextEditor from "./text-editor";

const CreatePost = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a post</CardTitle>
        <CardDescription>Start a new discussion</CardDescription>
      </CardHeader>
      <CardContent>
        <TextEditor />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default CreatePost;
