import chroma from 'chroma-js';
import React, { useState, useEffect } from 'react';
import { Button, ColorSquare, Container, Inputs, Label, OutputContainer, Section, Table, TableContainer } from './components';

interface SectionData {
  name: string;
  color: string;
  generateContrast: boolean;
  inverse: boolean;
}

const App: React.FC = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [colorFormat, setColorFormat] = useState<'rgb' | 'hsl' | 'hex'>('hex');
  const [percentageValues, setPercentageValues] = useState<number[]>(Array.from({ length: 9 }, (_, i) => 5 + i * 10));

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
    setSections([...sections, { name: '', color: '#ffffff', generateContrast: true, inverse: false }]);
  };

  const updateSection = (index: number, field: keyof SectionData, value: string | boolean) => {
    const newSections = [...sections];
    newSections[index][field] = value as never;
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
        let css = '';

        const formatColor = (color: chroma.Color) => {
          switch (colorFormat) {
            case 'rgb':
              return color.css();
            case 'hsl':
              return color.css('hsl');
            case 'hex':
            default:
              return color.hex();
          }
        };

        for (let i = 0; i < 9; i++) {
          const brightness = percentageValues[i] / 100;
          const variantColor = baseColor.set('lab.l', brightness * 100);
          css += `  --color-${section.name}-${i + 1}00: ${formatColor(variantColor)};\n`;
        }

        if (section.generateContrast) {
          for (let i = 0; i < 9; i++) {
            const brightness = 1 - (percentageValues[i] / 100);
            const contrastColor = baseColor.set('lab.l', brightness * 100);
            css += `  --color-${section.name}-contrast-${i + 1}00: ${formatColor(contrastColor)};\n`;
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

  const updatePercentageValue = (index: number, value: number) => {
    const newValues = [...percentageValues];
    newValues[index] = value;
    setPercentageValues(newValues);
  };

  return (
    <Container>
      <Inputs>
        <Label>Color Format:</Label>
        <select value={colorFormat} onChange={(e) => setColorFormat(e.target.value as 'rgb' | 'hsl' | 'hex')}>
          <option value="rgb">RGB</option>
          <option value="hsl">HSL</option>
          <option value="hex">HEX</option>
        </select>
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
          const formatColor = (color: chroma.Color) => {
            switch (colorFormat) {
              case 'rgb':
                return color.css();
              case 'hsl':
                return color.css('hsl');
              case 'hex':
              default:
                return color.hex();
            }
          };
          return (
            <TableContainer key={index}>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: 0 }}></th>
                    <th>Variable Name</th>
                    <th>Value</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 9 }, (_, i) => {
                    const brightness = percentageValues[i] / 100;
                    const variantColor = baseColor.set('lab.l', brightness * 100);
                    return (
                      <tr key={`${section.name}-${i}`}>
                        <td style={{ width: 0 }}>
                          <ColorSquare color={formatColor(variantColor)} />
                        </td>
                        <td>{`--color-${section.name}-${i + 1}00`}</td>
                        <td>{formatColor(variantColor)}</td>
                        <td>
                          <input
                            type="number"
                            value={percentageValues[i]}
                            min="0"
                            max="100"
                            onChange={e => updatePercentageValue(i, parseFloat(e.target.value))}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {section.generateContrast &&
                    Array.from({ length: 9 }, (_, i) => {
                      const brightness = 1 - (percentageValues[i] / 100);
                      const contrastColor = baseColor.set('lab.l', brightness * 100);
                      return (
                        <tr key={`${section.name}-contrast-${i}`}>
                          <td style={{ width: 0 }}>
                            <ColorSquare color={formatColor(contrastColor)} />
                          </td>
                          <td>{`--color-${section.name}-contrast-${i + 1}00`}</td>
                          <td>{formatColor(contrastColor)}</td>
                          <td>
                            <input
                              type="number"
                              value={percentageValues[i]}
                              min="0"
                              max="100"
                              onChange={e => updatePercentageValue(i, parseFloat(e.target.value))}
                            />
                          </td>
                        </tr>
                      );
                    })}
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
