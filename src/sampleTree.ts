import { TreeNode } from './types';

export const sampleTree: TreeNode[] = [
  {
    id: '1',
    tag: 'html',
    classes: [],
    children: [
      {
        id: '2',
        tag: 'body',
        classes: [],
        children: [
          {
            id: '3',
            tag: 'div',
            classes: ['container'],
            children: [
              {
                id: '4',
                tag: 'h1',
                classes: ['title'],
                children: [],
              },
              {
                id: '5',
                tag: 'p',
                classes: [],
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];
