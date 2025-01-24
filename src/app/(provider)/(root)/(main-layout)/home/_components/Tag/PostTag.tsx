import Chips from "./Chips";

type PostTagProps = {
  tagList: {
    tag: {
      tag_name: string;
    } | null;
  }[];
};

function PostTag({ tagList }: PostTagProps) {
  return (
    <div className="flex gap-1.5 mt-4">
      {tagList.map((tag, idx) => {
        if (tag.tag)
          return <Chips text={tag.tag?.tag_name} intent="post" key={idx} />;
      })}
    </div>
  );
}

export default PostTag;
