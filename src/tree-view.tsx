"use client";

import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

type StripeVariant = "striped" | "non-striped";

export interface TreeViewRef {
  expandItem: (itemId: string) => void;
  collapseItem: (itemId: string) => void;
  toggleItem: (itemId: string) => void;
  expandAllItems: () => void;
  collapseAllItems: () => void;
  getExpandedIds: () => string[];
}

const treeVariants = cva(
  "group peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 leading-none"
);

const selectedTreeVariants = cva(
  "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
);

const dragOverVariants = cva(
  "bg-primary/20 text-primary-foreground border-2 border-dashed border-primary/50"
);

const treeLeafVariants = cva(
  "group peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 leading-none"
);

interface TreeDataItem {
  id: string;
  name: string;
  icon?: any;
  selectedIcon?: any;
  openIcon?: any;
  children?: TreeDataItem[];
  actions?: React.ReactNode;
  onClick?: () => void;
  draggable?: boolean;
  droppable?: boolean;
  disabled?: boolean;
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem[] | TreeDataItem;
  initialSelectedItemId?: string;
  onSelectChange?: (item: TreeDataItem | undefined) => void;
  expandAll?: boolean;
  defaultNodeIcon?: any;
  defaultLeafIcon?: any;
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void;
  stripeVariant?: StripeVariant;
  expandedItemIds?: string[];
  onExpansionChange?: (expandedIds: string[]) => void;
  defaultExpandedItemIds?: string[];
};

const TreeView = React.forwardRef<TreeViewRef, TreeProps>(
  (
    {
      data,
      initialSelectedItemId,
      onSelectChange,
      expandAll,
      defaultLeafIcon,
      defaultNodeIcon,
      className,
      onDocumentDrag,
      stripeVariant = "striped",
      expandedItemIds: controlledExpandedIds,
      onExpansionChange,
      defaultExpandedItemIds = [],
      ...props
    },
    ref
  ) => {
    const [selectedItemId, setSelectedItemId] = React.useState<
      string | undefined
    >(initialSelectedItemId);

    const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(
      null
    );

    const [internalExpandedIds, setInternalExpandedIds] = React.useState<
      string[]
    >(defaultExpandedItemIds);

    const isControlled = controlledExpandedIds !== undefined;
    const expandedIds = isControlled
      ? controlledExpandedIds
      : internalExpandedIds;

    const updateExpandedIds = React.useCallback(
      (newIds: string[]) => {
        if (isControlled) {
          onExpansionChange?.(newIds);
        } else {
          setInternalExpandedIds(newIds);
        }
      },
      [isControlled, onExpansionChange]
    );

    const expandItem = React.useCallback(
      (itemId: string) => {
        if (!expandedIds.includes(itemId)) {
          updateExpandedIds([...expandedIds, itemId]);
        }
      },
      [expandedIds, updateExpandedIds]
    );

    const collapseItem = React.useCallback(
      (itemId: string) => {
        updateExpandedIds(expandedIds.filter((id) => id !== itemId));
      },
      [expandedIds, updateExpandedIds]
    );

    const toggleItem = React.useCallback(
      (itemId: string) => {
        if (expandedIds.includes(itemId)) {
          collapseItem(itemId);
        } else {
          expandItem(itemId);
        }
      },
      [expandedIds, expandItem, collapseItem]
    );

    const expandAllItems = React.useCallback(() => {
      const allIds: string[] = [];
      const collectIds = (items: TreeDataItem[] | TreeDataItem) => {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            if (item.children) {
              allIds.push(item.id);
              collectIds(item.children);
            }
          });
        } else if (items.children) {
          allIds.push(items.id);
          collectIds(items.children);
        }
      };
      collectIds(data);
      updateExpandedIds(allIds);
    }, [data, updateExpandedIds]);

    const collapseAllItems = React.useCallback(() => {
      updateExpandedIds([]);
    }, [updateExpandedIds]);

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id);
        if (onSelectChange) {
          onSelectChange(item);
        }
      },
      [onSelectChange]
    );

    const handleDragStart = React.useCallback((item: TreeDataItem) => {
      setDraggedItem(item);
    }, []);

    const handleDrop = React.useCallback(
      (targetItem: TreeDataItem) => {
        if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
          onDocumentDrag(draggedItem, targetItem);
        }
        setDraggedItem(null);
      },
      [draggedItem, onDocumentDrag]
    );

    const autoExpandedIds = React.useMemo(() => {
      if (expandAll) {
        const allIds: string[] = [];
        const collectIds = (items: TreeDataItem[] | TreeDataItem) => {
          if (Array.isArray(items)) {
            items.forEach((item) => {
              if (item.children) {
                allIds.push(item.id);
                collectIds(item.children);
              }
            });
          } else if (items.children) {
            allIds.push(items.id);
            collectIds(items.children);
          }
        };
        collectIds(data);
        return allIds;
      }

      if (!initialSelectedItemId) {
        return [] as string[];
      }

      const ids: string[] = [];
      function walkTreeItems(
        items: TreeDataItem[] | TreeDataItem,
        targetId: string
      ) {
        if (items instanceof Array) {
          for (let i = 0; i < items.length; i++) {
            ids.push(items[i]!.id);
            if (walkTreeItems(items[i]!, targetId)) {
              return true;
            }
            ids.pop();
          }
        } else if (items.id === targetId) {
          return true;
        } else if (items.children) {
          return walkTreeItems(items.children, targetId);
        }
      }

      walkTreeItems(data, initialSelectedItemId);
      return ids;
    }, [data, expandAll, initialSelectedItemId]);

    const finalExpandedIds = React.useMemo(() => {
      if (expandAll) {
        return autoExpandedIds;
      }
      return [...new Set([...expandedIds, ...autoExpandedIds])];
    }, [expandedIds, autoExpandedIds, expandAll]);

    React.useImperativeHandle(
      ref,
      () => ({
        expandItem,
        collapseItem,
        toggleItem,
        expandAllItems,
        collapseAllItems,
        getExpandedIds: () => expandedIds,
      }),
      [
        expandItem,
        collapseItem,
        toggleItem,
        expandAllItems,
        collapseAllItems,
        expandedIds,
      ]
    );

    return (
      <div className={cn("relative overflow-hidden", className)} {...props}>
        <TreeItem
          data={data}
          selectedItemId={selectedItemId}
          handleSelectChange={handleSelectChange}
          expandedItemIds={finalExpandedIds}
          defaultLeafIcon={defaultLeafIcon}
          defaultNodeIcon={defaultNodeIcon}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          draggedItem={draggedItem}
          stripeVariant={stripeVariant}
          onExpansionChange={updateExpandedIds}
        />
        <div
          className="h-[48px] w-full"
          onDrop={(e) => {
            handleDrop({ id: "", name: "parent_div" });
          }}
        ></div>
      </div>
    );
  }
);
TreeView.displayName = "TreeView";

type TreeItemProps = TreeProps & {
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  defaultNodeIcon?: any;
  defaultLeafIcon?: any;
  handleDragStart?: (item: TreeDataItem) => void;
  handleDrop?: (item: TreeDataItem) => void;
  draggedItem: TreeDataItem | null;
  stripeVariant?: StripeVariant;
  onExpansionChange?: (expandedIds: string[]) => void;
};

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      selectedItemId,
      handleSelectChange,
      expandedItemIds,
      defaultNodeIcon,
      defaultLeafIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      stripeVariant = "striped",
      onExpansionChange,
      ...props
    },
    ref
  ) => {
    if (!(data instanceof Array)) {
      data = [data];
    }
    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul className="space-y-0.5">
          {data.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <TreeNode
                  item={item}
                  selectedItemId={selectedItemId}
                  expandedItemIds={expandedItemIds}
                  handleSelectChange={handleSelectChange}
                  defaultNodeIcon={defaultNodeIcon}
                  defaultLeafIcon={defaultLeafIcon}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                  draggedItem={draggedItem}
                  stripeVariant={stripeVariant}
                  onExpansionChange={onExpansionChange}
                />
              ) : (
                <TreeLeaf
                  item={item}
                  selectedItemId={selectedItemId}
                  handleSelectChange={handleSelectChange}
                  defaultLeafIcon={defaultLeafIcon}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                  draggedItem={draggedItem}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);
TreeItem.displayName = "TreeItem";

const TreeNode = ({
  item,
  handleSelectChange,
  expandedItemIds,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
  handleDragStart,
  handleDrop,
  draggedItem,
  stripeVariant = "striped",
  onExpansionChange,
}: {
  item: TreeDataItem;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  selectedItemId?: string;
  defaultNodeIcon?: any;
  defaultLeafIcon?: any;
  handleDragStart?: (item: TreeDataItem) => void;
  handleDrop?: (item: TreeDataItem) => void;
  draggedItem: TreeDataItem | null;
  stripeVariant?: StripeVariant;
  onExpansionChange?: (expandedIds: string[]) => void;
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const isExpanded = expandedItemIds.includes(item.id);
  const value = isExpanded ? [item.id] : [];

  const onDragStart = (e: React.DragEvent) => {
    if (!item.draggable) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", item.id);
    handleDragStart?.(item);
  };

  const onDragOver = (e: React.DragEvent) => {
    if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleDrop?.(item);
  };

  const handleValueChange = (newValue: string[]) => {
    if (onExpansionChange) {
      const newExpandedIds = newValue.includes(item.id)
        ? [...expandedItemIds.filter((id) => id !== item.id), item.id]
        : expandedItemIds.filter((id) => id !== item.id);
      onExpansionChange(newExpandedIds);
    }
  };

  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={value}
      onValueChange={handleValueChange}
    >
      <AccordionPrimitive.Item value={item.id}>
        <div className="group">
          <div
            className={cn(
              treeVariants(),
              selectedItemId === item.id && selectedTreeVariants(),
              isDragOver && dragOverVariants(),
              "flex-1"
            )}
            data-active={selectedItemId === item.id}
            draggable={!!item.draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <AccordionTrigger
              onClick={() => {
                handleSelectChange(item);
                item.onClick?.();
              }}
              classNameHeader="w-full w-[calc(100%-34px)]"
            >
              <TreeIcon
                item={item}
                isSelected={selectedItemId === item.id}
                isOpen={value.includes(item.id)}
                default={defaultNodeIcon}
              />
              <span className="flex-1 truncate text-left text-sm font-medium leading-none">
                {item.name}
              </span>
            </AccordionTrigger>

            {item.actions && (
              <div className="flex shrink-0 items-center">
                <TreeActions>{item.actions}</TreeActions>
              </div>
            )}
          </div>
        </div>
        <AccordionContent
          className={cn("ml-4 pl-1", stripeVariant === "striped" && "border-l")}
        >
          <TreeItem
            data={item.children ? item.children : item}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            draggedItem={draggedItem}
            stripeVariant={stripeVariant}
            onExpansionChange={onExpansionChange}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
};

const TreeLeaf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem;
    selectedItemId?: string;
    handleSelectChange: (item: TreeDataItem | undefined) => void;
    defaultLeafIcon?: any;
    handleDragStart?: (item: TreeDataItem) => void;
    handleDrop?: (item: TreeDataItem) => void;
    draggedItem: TreeDataItem | null;
  }
>(
  (
    {
      className,
      item,
      selectedItemId,
      handleSelectChange,
      defaultLeafIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false);

    const onDragStart = (e: React.DragEvent) => {
      if (!item.draggable || item.disabled) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/plain", item.id);
      handleDragStart?.(item);
    };

    const onDragOver = (e: React.DragEvent) => {
      if (
        item.droppable !== false &&
        !item.disabled &&
        draggedItem &&
        draggedItem.id !== item.id
      ) {
        e.preventDefault();
        setIsDragOver(true);
      }
    };

    const onDragLeave = () => {
      setIsDragOver(false);
    };

    const onDrop = (e: React.DragEvent) => {
      if (item.disabled) return;
      e.preventDefault();
      setIsDragOver(false);
      handleDrop?.(item);
    };

    return (
      <div
        ref={ref}
        className={cn(
          treeLeafVariants(),
          className,
          selectedItemId === item.id && selectedTreeVariants(),
          isDragOver && dragOverVariants(),
          item.disabled && "pointer-events-none cursor-not-allowed opacity-50",
          "group"
        )}
        onClick={() => {
          if (item.disabled) return;
          handleSelectChange(item);
          item.onClick?.();
        }}
        draggable={!!item.draggable && !item.disabled}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        {...props}
      >
        <TreeIcon
          item={item}
          isSelected={selectedItemId === item.id}
          default={defaultLeafIcon}
        />
        <span className="flex-grow truncate text-sm leading-none">
          {item.name}
        </span>
        <TreeActions>{item.actions}</TreeActions>
      </div>
    );
  }
);
TreeLeaf.displayName = "TreeLeaf";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    classNameHeader?: string;
  }
>(({ className, classNameHeader, children, ...props }, ref) => (
  <AccordionPrimitive.Header className={cn("", classNameHeader)}>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full flex-1 items-center gap-2 transition-[width,height,padding] first:[&[data-state=open]>svg]:first-of-type:rotate-90",
        className
      )}
      {...props}
    >
      <ChevronRight className="h-3 w-3 shrink-0 transition-transform duration-200" />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all duration-200",
      className
    )}
    {...props}
  >
    <div className="py-1">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

const TreeIcon = ({
  item,
  isOpen,
  isSelected,
  default: defaultIcon,
}: {
  item: TreeDataItem;
  isOpen?: boolean;
  isSelected?: boolean;
  default?: any;
}) => {
  let Icon = defaultIcon;
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon;
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon;
  } else if (item.icon) {
    Icon = item.icon;
  }
  return Icon ? (
    <Icon className="h-4 w-4 shrink-0" />
  ) : (
    <div className="h-4 w-4 shrink-0" />
  );
};

const TreeActions = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "ml-auto opacity-0 transition-opacity duration-200",
        "group-hover:opacity-100",
        "has-[button[data-state=open]]:opacity-100"
      )}
    >
      <div className="[&_button]:data-[state=open]:bg-sidebar-accent [&_button]:data-[state=open]:text-sidebar-accent-foreground">
        {children}
      </div>
    </div>
  );
};

export { TreeView, type StripeVariant, type TreeDataItem };
