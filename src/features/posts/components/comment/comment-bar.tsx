// const CommentBar = ({ post }: { post: Post }) => {
//   return (
//     <Tabs defaultValue="all" className="sticky top-0 z-10 bg-white">
//       <TabsList className="flex gap-2 p-6 rounded-none">
//         <TabsTrigger value="all" asChild>
//           <Button variant="ghost">
//             <MessagesSquare /> All
//           </Button>
//         </TabsTrigger>
//         <TabsTrigger value="support" asChild>
//           <Button variant="ghost">
//             <HeartHandshake /> Support
//           </Button>
//         </TabsTrigger>
//         <TabsTrigger value="oppose" asChild>
//           <Button variant="ghost">
//             <Swords /> Oppose
//           </Button>
//         </TabsTrigger>
//       </TabsList>
//       <TabsContent value="all">
//         <PostComments post={post} />
//       </TabsContent>
//       <TabsContent value="support">
//         <PostComments post={post} />
//       </TabsContent>
//       <TabsContent value="oppose">
//         <PostComments post={post} />
//       </TabsContent>
//     </Tabs>
//   );
// };

// export default CommentBar;
