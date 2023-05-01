import { Command } from "https://deno.land/x/cliffy@v0.25.2/mod.ts";
import {
  emptyDirSync,
  walkSync,
} from "https://deno.land/std@0.160.0/fs/mod.ts";
import {
  basename,
  dirname,
  relative,
} from "https://deno.land/std@0.160.0/path/mod.ts";

await new Command()
  .name("luau-to-rojo")
  .version("0.1.0")
  .description("Converts a Luau project to a Rojo project.")
  .arguments("<path:string> <outputPath:string>")
  .option(
    "-r, --root <rootPath:string>",
    "The root path of the Luau project to resolve requires from",
    { default: "." },
  )
  .option(
    "-n, --name [name:string]",
    "The name of the Rojo project, defaults to the root directory's name",
  )
  .action(({ root, name }, path, outputPath) => {
    root = Deno.realPathSync(root);
    path = Deno.realPathSync(path);
    const pathRelativeToRoot = relative(root, path);

    emptyDirSync(outputPath);
    Deno.mkdirSync(outputPath + "/src", { recursive: true });

    // Convert outputPath to a RegExp that can be skipped
    // This code is magic spit out by copilot.
    const skipPath = new RegExp(
      outputPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
    );
    for (
      const entry of walkSync(path, {
        exts: [".lua", ".luau"],
        skip: [skipPath],
      })
    ) {
      if (!entry.isFile) continue;
      const relativePath = entry.path.substring(path.length);
      // Find the depth of the path
      const depth = relativePath.split("/").length - 1;
      // if it's a directory, create it in the output directory
      Deno.mkdirSync(dirname(outputPath + "/src" + relativePath), {
        recursive: true,
      });
      let text = Deno.readTextFileSync(entry.path);

      // Replace string-based require() calls with module-based require() calls.
      // We need to replace `/` with `.` to make it a valid module path.
      text = text.replace(
        /require\((.+)\)/g,
        (_match, p1) => {
          const normalizedPath = p1.replace(/\//g, ".").replace(
            pathRelativeToRoot.replace(/\//g, ".") + ".",
            "",
          );
          return `require(${normalizedPath})`;
        },
      );

      // We need to repeat `.Parent` based on the depth of the path.
      text = text.replace(
        /require\("(.+)"\)/g,
        `require(script${"\.Parent".repeat(depth)}.$1)`,
      );
      Deno.writeTextFileSync(
        outputPath + "/src" + relativePath,
        text,
      );
    }
    if (!name) name = basename(root);

    const rojoProject = { name, tree: { $path: "src" } };
    Deno.writeTextFileSync(
      outputPath + "/default.project.json",
      JSON.stringify(rojoProject, undefined, 2),
    );
  })
  .parse(Deno.args);
