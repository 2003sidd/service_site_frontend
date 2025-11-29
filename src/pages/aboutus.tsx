import React, { useCallback, useState, useMemo } from 'react'
import { createEditor, type Descendant, Editor, Transforms, Element as SlateElement } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import type { BaseEditor } from 'slate'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'

// --- 1. Custom Slate Types ---

// Define the custom marks (bold, italic, underline) on the Text node
type FormattedText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean }
// Custom Element definition, primarily for block-level styling (like alignment)
type ParagraphElement = { type: 'paragraph'; align?: 'left' | 'center' | 'right' | 'justify'; children: FormattedText[] }
type CustomElement = ParagraphElement

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor
    Element: CustomElement
    Text: FormattedText
  }
}

// --- 2. Editor Helpers ---

/** Toggles a text mark (bold, italic, underline) on the current selection. */
const toggleMark = (editor: BaseEditor, format: keyof FormattedText) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

/** Checks if a specific mark is active in the current selection. */
const isMarkActive = (editor: BaseEditor, format: keyof FormattedText) => {
  const marks = Editor.marks(editor) as FormattedText | null
  return marks ? marks[format] === true : false
}

/** Toggles block alignment (left, center, right, justify) on the current block element. */
const toggleBlock = (editor: BaseEditor, align: CustomElement['align']) => {
  const isActive = isBlockActive(editor, align)
  
  // Find the closest paragraph element to apply the alignment change
  const [match] = Editor.nodes(editor, {
    match: n => SlateElement.isElement(n) && n.type === 'paragraph',
  })

  if (!match) return;

  // If already active, remove the alignment property (defaults to browser 'left' or 'start')
  if (isActive) {
    Transforms.setNodes(editor, { align: undefined })
  } else {
    // Set the alignment property on the element
    Transforms.setNodes(editor, { align })
  }
}

/** Checks if a specific block alignment is active in the current selection. */
const isBlockActive = (editor: BaseEditor, align: CustomElement['align']) => {
  const [match] = Editor.nodes(editor, {
    match: n => SlateElement.isElement(n) && (n as ParagraphElement).align === align,
  })
  return !!match
}

// --- 3. Custom Slate Components (Element/Leaf Renderers) ---

// Element Renderer (handles block-level attributes like alignment)
const Element = (props: { attributes: any; children: React.ReactNode; element: CustomElement }) => {
  const { attributes, children, element } = props
  // Use the element's align property, default to 'left' if undefined
  const align = element.align || 'left'

  const style = { textAlign: align } as const

  // For simplicity, all text blocks are rendered as <p> tags with style applied
  return (
    <p style={style} {...attributes}>
      {children}
    </p>
  )
}

// Leaf Renderer (handles character-level marks like bold/italic)
const Leaf = (props: { attributes: any; children: React.ReactNode; leaf: FormattedText }) => {
  let { children, leaf, attributes } = props

  // Apply formatting based on marks present in the leaf node
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

// --- 4. Toolbar Components (Buttons) ---

// Mark Button Component (Bold, Italic, Underline)
const MarkButton = ({ format, children }: { format: keyof FormattedText; children: React.ReactNode }) => {
  const editor = useSlate() // Get the editor instance from context
  const isActive = isMarkActive(editor, format)

  return (
    <button
      className={`p-2 rounded transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
      onMouseDown={event => {
        event.preventDefault() // Prevent the editor from losing focus
        toggleMark(editor, format)
      }}
      title={`Toggle ${format}`}
    >
      {children}
    </button>
  )
}

// Block Button Component (Alignment)
const BlockButton = ({ align, children }: { align: CustomElement['align']; children: React.ReactNode }) => {
  const editor = useSlate() // Get the editor instance from context
  const isActive = isBlockActive(editor, align)

  return (
    <button
      className={`p-2 rounded transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
      onMouseDown={event => {
        event.preventDefault() // Prevent the editor from losing focus
        toggleBlock(editor, align)
      }}
      title={`Align ${align}`}
    >
      {children}
    </button>
  )
}

// Toolbar Component
const Toolbar = () => (
  <div className="flex flex-wrap gap-2 p-3 border-b border-gray-200 bg-gray-50 rounded-t-xl shadow-inner">
    {/* Marks */}
    <MarkButton format="bold">
      <Bold className="w-5 h-5" />
    </MarkButton>
    <MarkButton format="italic">
      <Italic className="w-5 h-5" />
    </MarkButton>
    <MarkButton format="underline">
      <Underline className="w-5 h-5" />
    </MarkButton>
    
    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
    
    {/* Blocks (Alignment) */}
    <BlockButton align="left">
      <AlignLeft className="w-5 h-5" />
    </BlockButton>
    <BlockButton align="center">
      <AlignCenter className="w-5 h-5" />
    </BlockButton>
    <BlockButton align="right">
      <AlignRight className="w-5 h-5" />
    </BlockButton>
    <BlockButton align="justify">
      <AlignJustify className="w-5 h-5" />
    </BlockButton>
  </div>
)

// --- 5. Main App Component ---

const App = () => {
  // Use useMemo to ensure the editor instance is stable
  const [editor] = useState(() => withReact(createEditor()))

  // Define render functions using useCallback for performance
  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

  const initialValue: Descendant[] = [
   
  ]

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Custom Slate Editor</h1>
      <div className="max-w-4xl mx-auto shadow-2xl rounded-xl bg-white ring-4 ring-indigo-500/50">
        <Slate editor={editor} initialValue={initialValue}>
          <Toolbar />
          <div className="p-6">
            <Editable
              className="min-h-[300px] text-lg outline-none"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Start typing your content here..."
              spellCheck
              autoFocus
            />
          </div>
        </Slate>
      </div>
    </div>
  )
}

export default App