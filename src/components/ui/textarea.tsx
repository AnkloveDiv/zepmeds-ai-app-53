
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    React.useEffect(() => {
      if (maxRows && textareaRef.current) {
        const element = textareaRef.current;
        
        const handleInput = () => {
          // Reset the height first to get the correct scrollHeight
          element.style.height = 'auto';
          
          // Calculate scrollHeight and lineHeight
          const lineHeight = parseInt(getComputedStyle(element).lineHeight) || 20;
          const paddingTop = parseInt(getComputedStyle(element).paddingTop) || 0;
          const paddingBottom = parseInt(getComputedStyle(element).paddingBottom) || 0;
          const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
          
          // Set the height
          element.style.height = Math.min(element.scrollHeight, maxHeight) + 'px';
        };
        
        element.addEventListener('input', handleInput);
        
        // Initial calculation
        handleInput();
        
        return () => {
          element.removeEventListener('input', handleInput);
        };
      }
    }, [maxRows]);
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={(element) => {
          if (typeof ref === 'function') {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
          textareaRef.current = element;
        }}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
