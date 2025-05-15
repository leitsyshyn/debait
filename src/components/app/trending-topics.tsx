import { Badge } from "../ui/badge";

const TrendingTopics = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary" className="mb-2">
        #some topic
      </Badge>
      <Badge variant="secondary" className="mb-2">
        #some topic
      </Badge>
      <Badge variant="secondary" className="mb-2">
        #some topic
      </Badge>
      <Badge variant="secondary" className="mb-2">
        #some topic
      </Badge>
      <Badge variant="secondary" className="mb-2">
        #some topic
      </Badge>
    </div>
  );
};

export default TrendingTopics;
