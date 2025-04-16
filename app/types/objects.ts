export type Collection = {
  name: string;
  total: number;
  //TODO: Waiting to figure out with Danny how to best solve this
  vectorizer: any;
  processed: boolean;
};

export type DecisionTreeNode = {
  name: string;
  id: string;
  description: string;
  instruction: string;
  reasoning: string;
  options: { [key: string]: DecisionTreeNode };
  choosen?: boolean;
  blocked?: boolean;
};
