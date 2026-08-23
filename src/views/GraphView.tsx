import React, { useEffect, useRef, useState } from 'react';
import { useRepositoryStore } from '../store';
import { formatDate, shortHash, stringToColor } from '../utils/format';
import type { GraphData } from '../types/git';
import { buildGraphData } from '../services/graph';
import styles from './GraphView.module.css';

export default function GraphView() {
  const { commits, selectedCommitHash, selectCommit } = useRepositoryStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  const rowHeight = 40;
  const colWidth = 20;

  useEffect(() => {
    setGraphData(buildGraphData(commits));
  }, [commits]);

  useEffect(() => {
    if (!canvasRef.current || !graphData || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = Math.max(containerRef.current.clientWidth, 400);
    const height = graphData.nodes.length * rowHeight;
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    const graphWidth = graphData.maxColumns * colWidth + 40;

    // Draw edges
    ctx.lineWidth = 2;
    graphData.edges.forEach(edge => {
      const startX = 20 + edge.fromCol * colWidth;
      const startY = edge.fromRow * rowHeight + rowHeight / 2;
      const endX = 20 + edge.toCol * colWidth;
      const endY = edge.toRow * rowHeight + rowHeight / 2;

      ctx.strokeStyle = edge.color;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      if (startX === endX) {
        ctx.lineTo(endX, endY);
      } else {
        // Curve
        ctx.bezierCurveTo(startX, startY + 15, endX, endY - 15, endX, endY);
      }
      ctx.stroke();
    });

    // Draw nodes
    graphData.nodes.forEach(node => {
      const x = 20 + node.column * colWidth;
      const y = node.row * rowHeight + rowHeight / 2;
      
      const isSelected = selectedCommitHash === node.commit.hash;

      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 6 : 5, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      if (isSelected) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.strokeStyle = node.color;
        ctx.stroke();
      } else {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#1c2128'; // bg-surface
        ctx.stroke();
      }
    });

  }, [graphData, selectedCommitHash]);

  if (!graphData) return null;

  const graphWidth = graphData.maxColumns * colWidth + 40;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ width: graphWidth }} className={styles.colGraph}>Graph</div>
        <div className={styles.colMessage}>Message</div>
        <div className={styles.colAuthor}>Author</div>
        <div className={styles.colDate}>Date</div>
        <div className={styles.colHash}>Hash</div>
      </div>
      
      <div className={styles.scrollArea} ref={containerRef}>
        <div className={styles.canvasContainer} style={{ height: graphData.nodes.length * rowHeight }}>
          <canvas ref={canvasRef} className={styles.canvas} />
          
          {/* Overlay HTML elements for interactivity and text rendering */}
          <div className={styles.overlay}>
            {graphData.nodes.map((node) => (
              <div 
                key={node.commit.hash}
                className={`${styles.row} ${selectedCommitHash === node.commit.hash ? styles.selected : ''}`}
                style={{ height: rowHeight, top: node.row * rowHeight }}
                onClick={() => selectCommit(node.commit.hash)}
              >
                <div style={{ width: graphWidth }} className={styles.spacer} />
                
                <div className={styles.colMessage}>
                  <span className={styles.messageText}>{node.commit.message}</span>
                  {node.commit.refs.map(ref => (
                    <span key={ref.name} className={`${styles.refBadge} ${styles[`ref-${ref.type}`]}`}>
                      {ref.name}
                    </span>
                  ))}
                </div>
                
                <div className={styles.colAuthor}>
                  <div className={styles.avatar} style={{ backgroundColor: node.color }}>
                    {node.commit.author.charAt(0)}
                  </div>
                  <span className={styles.authorName}>{node.commit.author}</span>
                </div>
                
                <div className={styles.colDate}>
                  {formatDate(node.commit.date)}
                </div>
                
                <div className={styles.colHash}>
                  {node.commit.shortHash}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
