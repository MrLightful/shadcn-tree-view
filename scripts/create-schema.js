const fs = require("fs");

fs.readFile(
  __dirname + "/../src/tree-view.tsx",
  "utf8",
  (err, content) => {
    if (err) {
      console.error(err);
      return;
    }

    const schema = {
      name: "tree-view",
      type: "registry:block",
      dependencies: [
        '@radix-ui/react-accordion',
        'class-variance-authority'
      ],
      devDependencies: [],
      registryDependencies: [],
      files: [
        {
          path: "components/tree-view.tsx",
          type: "registry:block",
          content: content,
        },
      ],
      tailwind: {},
      cssVars: {},
      meta: {
        importSpecifier: "TreeView",
        moduleSpecifier: "@/components/tree-view",
      },
    };

    fs.writeFile("./schema.json", JSON.stringify(schema, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("schema created!");
    });
  }
);
