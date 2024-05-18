import chroma from 'chroma-js';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, ColorSquare, Container, Inputs, Label, OutputContainer, Section, Table, TableContainer } from './components';

interface SectionData {
  name: string;
  color: string;
  generateContrast: boolean;
  inverse: boolean;
  includeEdges: boolean;
}

const App: React.FC = () => {
  const [sections, setSections] = useState<SectionData[]>([]);

  useEffect(() => {
    const savedSections = localStorage.getItem('sections');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sections', JSON.stringify(sections));
  }, [sections]);

  const addSection = () => {
    setSections([...sections, { name: '', color: '#ffffff', generateContrast: true, inverse: false, includeEdges: false }]);
  };

  const updateSection = (index: number, field: keyof SectionData, value: any) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setSections(newSections);
  };

  const generateCSS = () => {
    return sections
      .map(section => {
        if (!section.name || !section.color) return '';
        const baseColor = chroma(section.color);
        const baseLab = baseColor.lab();
        let css = '';

        if (section.includeEdges) {
          css += `  --color-${section.name}-0: ${chroma.lab([baseLab[0], baseLab[1], baseLab[2]]).hex()};\n`;
          css += `  --color-${section.name}-1000: ${chroma.lab([100, baseLab[1], baseLab[2]]).hex()};\n`;
        }

        for (let i = 1; i <= 9; i++) {
          const lightness = section.inverse ? baseLab[0] - (i - 5) * 10 : baseLab[0] + (i - 5) * 10;
          const variantColor = chroma.lab([lightness, baseLab[1], baseLab[2]]);
          css += `  --color-${section.name}-${i}00: ${variantColor.hex()};\n`;
        }

        if (section.generateContrast) {
          for (let i = 1; i <= 9; i++) {
            const lightness = section.inverse ? 100 - (baseLab[0] - (i - 5) * 10) : 100 - (baseLab[0] + (i - 5) * 10);
            const contrastColor = chroma.lab([lightness, baseLab[1], baseLab[2]]);
            css += `  --color-${section.name}-contrast-${i}00: ${contrastColor.hex()};\n`;
          }
        }
        return css;
      })
      .join('');
  };

  const copyToClipboard = () => {
    const css = `:root {\n${generateCSS()}}`;
    navigator.clipboard.writeText(css).then(() => {
      alert('CSS copied to clipboard!');
    });
  };

  const handleExport = () => {
    const json = JSON.stringify(sections);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sections.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSections(JSON.parse(result));
      };
      reader.readAsText(file);
    }
  };

  return (
    <Container>
      <Inputs>
        {sections.map((section, index) => (
          <Section key={index}>
            <Label>Name:</Label>
            <input
              type="text"
              value={section.name}
              onChange={e => updateSection(index, 'name', e.target.value)}
              placeholder="e.g., primary"
            />
            <Label>Color:</Label>
            <input
              type="color"
              value={section.color}
              onChange={e => updateSection(index, 'color', e.target.value)}
            />
            <Label>
              <input
                type="checkbox"
                checked={section.generateContrast}
                onChange={e => updateSection(index, 'generateContrast', e.target.checked)}
              />
              Generate Contrast
            </Label>
            <Label>
              <input
                type="checkbox"
                checked={section.inverse}
                onChange={e => updateSection(index, 'inverse', e.target.checked)}
              />
              Inverse
            </Label>
            <Label>
              <input
                type="checkbox"
                checked={section.includeEdges}
                onChange={e => updateSection(index, 'includeEdges', e.target.checked)}
              />
              Include Edges
            </Label>
            <button onClick={() => removeSection(index)}>Remove</button>
            <button onClick={() => moveSectionUp(index)}>⬆</button>
            <button onClick={() => moveSectionDown(index)}>⬇</button>
          </Section>
        ))}
        <button onClick={addSection}>Add Section</button>
        <Button onClick={copyToClipboard}>Copy</Button>
        <Button onClick={handleExport}>Export</Button>
        <input type="file" accept="application/json" onChange={handleImport} />
      </Inputs>

      <OutputContainer>
        {sections.map((section, index) => {
          if (!section.name || !section.color) return null;
          const baseColor = chroma(section.color);
          const baseLab = baseColor.lab();
          return (
            <TableContainer key={index}>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: 0 }}></th>
                    <th>Variable Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {section.includeEdges && (
                    <>
                      <tr>
                        <td style={{ width: 0 }}>
                          <ColorSquare color={chroma.lab([baseLab[0], baseLab[1], baseLab[2]]).hex()} />
                        </td>
                        <td>{`--color-${section.name}-0`}</td>
                        <td>{chroma.lab([baseLab[0], baseLab[1], baseLab[2]]).hex()}</td>
                      </tr>
                    </>
                  )}
                  {Array.from({ length: 9 }, (_, i) => {
                    const lightness = section.inverse ? baseLab[0] - (i - 4) * 10 : baseLab[0] + (i - 4) * 10;
                    return (
                      <tr key={`${section.name}-${i}`}>
                        <td style={{ width: 0 }}>
                          <ColorSquare color={chroma.lab([lightness, baseLab[1], baseLab[2]]).hex()} />
                        </td>
                        <td>{`--color-${section.name}-${i + 1}00`}</td>
                        <td>{chroma.lab([lightness, baseLab[1], baseLab[2]]).hex()}</td>
                      </tr>
                    );
                  })}
                  {section.includeEdges && (
                    <>
                      <tr>
                        <td style={{ width: 0 }}>
                          <ColorSquare color={chroma.lab([100, baseLab[1], baseLab[2]]).hex()} />
                        </td>
                        <td>{`--color-${section.name}-1000`}</td>
                        <td>{chroma.lab([100, baseLab[1], baseLab[2]]).hex()}</td>
                      </tr>
                    </>
                  )}
                  {section.generateContrast && section.includeEdges && (
                    <>
                      <tr>
                        <td style={{ width: 0 }}>
                          <ColorSquare color={chroma.lab([100, baseLab[1], baseLab[2]]).hex()} />
                        </td>
                        <td>{`--color-${section.name}-contrast-0`}</td>
                        <td>{chroma.lab([100, baseLab[1], baseLab[2]]).hex()}</td>
                      </tr>
                    </>
                  )}
                  {section.generateContrast &&
                    Array.from({ length: 9 }, (_, i) => {
                      const lightness = !section.inverse ? baseLab[0] - (i - 4) * 10 : baseLab[0] + (i - 4) * 10;
                      return (
                        <tr key={`${section.name}-contrast-${i}`}>
                          <td style={{ width: 0 }}>
                            <ColorSquare color={chroma.lab([lightness, baseLab[1], baseLab[2]]).hex()} />
                          </td>
                          <td>{`--color-${section.name}-contrast-${i + 1}00`}</td>
                          <td>{chroma.lab([lightness, baseLab[1], baseLab[2]]).hex()}</td>
                        </tr>
                      );
                    })}
                  {section.generateContrast && section.includeEdges && (
                    <>
                      <tr>
                        <td style={{ width: 0 }}>
                          <ColorSquare color={chroma.lab([0, baseLab[1], baseLab[2]]).hex()} />
                        </td>
                        <td>{`--color-${section.name}-contrast-1000`}</td>
                        <td>{chroma.lab([0, baseLab[1], baseLab[2]]).hex()}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </Table>
            </TableContainer>
          );
        })}
      </OutputContainer>
    </Container>
  );
};

export default App;
