import { useState, useEffect, useRef } from "react";
import type { InfoPanelProps } from "./types";
import { defaultAnatomyData } from "./defaultAnatomyData";

export function InfoPanel({ 
  selectedPartId, 
  anatomyData = defaultAnatomyData,
  renderContent,
  onClose,
  position = 'right',
  title
}: InfoPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevPartId = useRef<string | null>(null);

  useEffect(() => {
    if (selectedPartId) {
      if (prevPartId.current !== selectedPartId) {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 150);
        prevPartId.current = selectedPartId;
        return () => clearTimeout(timer);
      }
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedPartId]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedPartId]);

  if (!selectedPartId) return null;

  const partInfo = anatomyData[selectedPartId];
  const displayTitle = title || partInfo?.name || selectedPartId;
  const accentColor = partInfo?.color || '#3b82f6';

  const positionStyles = position === 'left' 
    ? { left: '16px', right: 'auto' }
    : { right: '16px', left: 'auto' };

  return (
    <div 
      style={{
        position: 'absolute',
        top: '16px',
        bottom: '80px',
        ...positionStyles,
        width: '360px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        zIndex: 100,
        fontFamily: 'Inter, system-ui, sans-serif',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : (position === 'right' ? 'translateX(20px)' : 'translateX(-20px)'),
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          padding: '20px 20px 16px 20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 
              style={{
                margin: 0,
                fontSize: '1.35rem',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.3,
                wordWrap: 'break-word'
              }}
            >
              {displayTitle}
            </h2>
            <div 
              style={{
                width: '40px',
                height: '4px',
                backgroundColor: accentColor,
                borderRadius: '2px',
                marginTop: '10px'
              }}
            />
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '12px',
              flexShrink: 0,
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div 
        ref={contentRef}
        style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '20px',
          opacity: isLoading ? 0.5 : 1,
          transition: 'opacity 0.15s ease'
        }}
      >
        {renderContent ? (
          <div style={{ 
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: '#374151'
          }}>
            {renderContent(selectedPartId)}
          </div>
        ) : partInfo ? (
          <>
            <p 
              style={{
                margin: '0 0 20px 0',
                color: '#4b5563',
                lineHeight: 1.7,
                fontSize: '0.95rem'
              }}
            >
              {partInfo.description}
            </p>

            <div>
              <h3 
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                Key Facts
              </h3>
              <ul 
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none'
                }}
              >
                {partInfo.facts.map((fact, index) => (
                  <li 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                      fontSize: '0.9rem',
                      color: '#4b5563',
                      lineHeight: 1.5
                    }}
                  >
                    <span 
                      style={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        backgroundColor: partInfo.color,
                        borderRadius: '50%',
                        marginTop: '8px',
                        marginRight: '12px',
                        flexShrink: 0
                      }}
                    />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            No information available for this region.
          </p>
        )}
      </div>
    </div>
  );
}

export function InfoSection({ 
  title, 
  children, 
  collapsed = false,
  accentColor = '#3b82f6'
}: { 
  title: string; 
  children: React.ReactNode; 
  collapsed?: boolean;
  accentColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(!collapsed);

  return (
    <div style={{ 
      marginBottom: '16px',
      borderRadius: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ 
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '4px',
            height: '16px',
            backgroundColor: accentColor,
            borderRadius: '2px'
          }} />
          {title}
        </span>
        <span style={{ 
          color: '#9ca3af',
          fontSize: '0.75rem',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{ 
          padding: '0 14px 14px 14px',
          fontSize: '0.9rem',
          color: '#4b5563',
          lineHeight: 1.6
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function InfoList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item, index) => (
        <li key={index} style={{ 
          padding: '6px 0',
          borderBottom: index < items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
          fontSize: '0.9rem'
        }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function InfoBadge({ 
  label, 
  color = '#3b82f6' 
}: { 
  label: string; 
  color?: string;
}) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      backgroundColor: `${color}15`,
      color: color,
      borderRadius: '12px',
      fontSize: '0.8rem',
      fontWeight: 500,
      marginRight: '6px',
      marginBottom: '6px'
    }}>
      {label}
    </span>
  );
}

export function InfoStatus({ 
  status, 
  type = 'info' 
}: { 
  status: string; 
  type?: 'success' | 'warning' | 'error' | 'info';
}) {
  const colors = {
    success: { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
    warning: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    error: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
    info: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' }
  };

  const c = colors[type];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 14px',
      backgroundColor: c.bg,
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: 500,
      color: c.text
    }}>
      <span style={{
        width: '8px',
        height: '8px',
        backgroundColor: c.dot,
        borderRadius: '50%'
      }} />
      {status}
    </div>
  );
}
