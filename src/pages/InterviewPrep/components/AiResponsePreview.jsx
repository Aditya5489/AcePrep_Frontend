import React from 'react'
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AiResponsePreview = ({ content }) => {
  const [copied, setCopied] = React.useState(false);
  
  if (!content) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/preview">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 p-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg opacity-0 group-hover/preview:opacity-100 transition-opacity hover:bg-gray-700"
      >
        {copied ? (
          <LuCheck className="w-4 h-4 text-green-400" />
        ) : (
          <LuCopy className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Markdown content */}
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Paragraphs
            p({ children }) {
              return <p className="text-gray-300 leading-relaxed mb-4 last:mb-0">{children}</p>;
            },
            
            // Text formatting
            strong({ children }) {
              return <strong className="font-semibold text-cyan-300">{children}</strong>;
            },
            em({ children }) {
              return <em className="italic text-blue-300">{children}</em>;
            },
            
            // Lists
            ul({ children }) {
              return <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300">{children}</ol>;
            },
            li({ children }) {
              return <li className="text-gray-300 marker:text-cyan-500">{children}</li>;
            },
            
            // Blockquotes
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-cyan-500/50 bg-cyan-500/5 pl-4 py-2 my-4 rounded-r-lg">
                  <div className="text-gray-400 italic">{children}</div>
                </blockquote>
              );
            },
            
            // Headings
            h1({ children }) {
              return <h1 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-gray-700">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="text-xl font-bold text-white mb-3 pb-1 border-b border-gray-800">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="text-lg font-semibold text-cyan-400 mb-2">{children}</h3>;
            },
            h4({ children }) {
              return <h4 className="text-base font-semibold text-blue-400 mb-2">{children}</h4>;
            },
            
            // Links
            a({ children, href }) {
              return (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                >
                  {children}
                </a>
              );
            },
            
            // Tables
            table({ children }) {
              return (
                <div className="overflow-x-auto my-4 border border-gray-700 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-700">
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children }) {
              return <thead className="bg-gray-800/50">{children}</thead>;
            },
            tbody({ children }) {
              return <tbody className="divide-y divide-gray-700">{children}</tbody>;
            },
            tr({ children }) {
              return <tr className="hover:bg-gray-800/30 transition-colors">{children}</tr>;
            },
            th({ children }) {
              return (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return <td className="px-4 py-3 text-sm text-gray-300">{children}</td>;
            },
            
            // Horizontal rule
            hr() {
              return <hr className="my-6 border-gray-700" />;
            },
            
            // Images
            img({ src, alt }) {
              return (
                <img 
                  src={src} 
                  alt={alt} 
                  className="rounded-lg max-w-full h-auto my-4 border border-gray-700"
                />
              );
            },
            
            // Code blocks
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              
              if (!inline && match) {
                return (
                  <div className="relative group my-4">
                    <div className="absolute top-2 right-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded px-2 py-1 text-xs text-gray-400">
                      {match[1]}
                    </div>
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg !mt-0"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                );
              }
              
              return (
                <code className="bg-gray-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default AiResponsePreview;