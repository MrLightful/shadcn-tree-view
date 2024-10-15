# Tree View - [Shadcn UI](https://ui.shadcn.com/)
The Tree View component allows you to navigate hierarchical lists of data with nested levels that can be expanded and collapsed.

Based on [implementation](https://github.com/shadcn-ui/ui/issues/355#issuecomment-1703767574) by [WangLarry](https://github.com/WangLarry) and [bytechase](https://github.com/bytechase).

![demo gif](./demo.gif)

### [DEMO](https://mrlightful.com/ui/tree-view)

## Features
- [x] Expand, collapse, and select items
- [x] Custom icons per item (default, open, selected)
- [x] Default node & leaf icons per tree view
- [x] Action buttons (e.g. a button to add a new item)
- [x] Click handlers per tree item and per the entire tree view.

## Installation

```sh
npx shadcn add "https://mrlightful.com/registry/tree-view"
```

## Usage

### Props
#### Tree View
```tsx
type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
    data: TreeDataItem[] | TreeDataItem
    initialSelectedItemId?: string
    onSelectChange?: (item: TreeDataItem | undefined) => void
    expandAll?: boolean
    defaultNodeIcon?: any
    defaultLeafIcon?: any
}
```

#### Tree Item
```tsx
interface TreeDataItem {
    id: string
    name: string
    icon?: any
    selectedIcon?: any
    openIcon?: any
    children?: TreeDataItem[]
    actions?: React.ReactNode
    onClick?: () => void
}
```

### Basic
```tsx
import { TreeView, TreeDataItem } from '@/components/ui/tree-view';

const data: TreeDataItem[] = [
  {
    id: '1',
    name: 'Item 1',
    children: [
      {
        id: '2',
        name: 'Item 1.1',
        children: [
          {
            id: '3',
            name: 'Item 1.1.1',
          },
          {
            id: '4',
            name: 'Item 1.1.2',
          },
        ],
      },
      {
        id: '5',
        name: 'Item 1.2',
      },
    ],
  },
  {
    id: '6',
    name: 'Item 2',
  },
];

<TreeView data={data} />;
```

## Roadmap
- [ ] Add support for disabled items (https://github.com/romatallinn/shadcn-tree-view/issues/1)
- [ ] Add support for programmatically controlling items (https://github.com/romatallinn/shadcn-tree-view/issues/2)
- [ ] Add support for striped and non-striped variants of the tree (https://github.com/romatallinn/shadcn-tree-view/issues/3)
- [ ] Add support for custom item renderers (https://github.com/romatallinn/shadcn-tree-view/issues/4)
- [ ] Add support for drag and drop? (not sure)

# License
Licensed under the MIT license, see [`LICENSE`](LICENSE).