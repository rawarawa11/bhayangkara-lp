import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"

export default function Page() {
  return <SimpleEditor value={""} onChange={function(value: string): void {
      throw new Error("Function not implemented.")
  } } />
}
