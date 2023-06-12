import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ChangeEvent, useState } from 'react';
import { names, colors, createUrl } from './src/Generator';
import './style.css';

import 'bootstrap/dist/css/bootstrap.css';

function mapOptions(o: object) {
  return Object.keys(o).map((k) => <option value={k}>{o[k]}</option>);
}

function ScanButton(props: {
  setUid: React.Dispatch<React.SetStateAction<string>>;
}) {
  const scan = () => {
    const ndef = new NDEFReader();
    ndef.scan().then(() => {
      ndef.onreadingerror = (event) => {
        console.log('Error:', event);
      };
      ndef.onreading = (event) => {
        props.setUid(event.serialNumber);
      };
    });
  };
  return <Button onClick={scan}>Scan</Button>;
}

export default function App() {
  const [fid, setFid] = useState<string>('16');
  const [uid, setUid] = useState<string>('');
  const [url, setUrl] = useState<string>();

  const onTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFid(event.target.value);
  };
  const onUidChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUid(event.target.value);
  };
  const getUidFromClipboard = () => {
    navigator.clipboard.readText().then((clipText) => {
      setUid(clipText);
    });
  };
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(url);
  };
  const generate = () => {
    createUrl(Number.parseInt(fid), uid).then((v) => {
      console.log(v);
      setUrl(v);
    });
  };
  return (
    <React.Fragment>
      <h1>Jooki URL Generator</h1>
      <Form>
        <p>Select the type and click generate to create the URL</p>
        <Form.Group controlId="color" as={Row} className="mb-3">
          <Form.Label column sm={1}>
            Type
          </Form.Label>
          <Col>
            <Form.Select value={fid} onChange={onTypeChange}>
              {mapOptions(names)}
              {mapOptions(colors)}
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group controlId="UID" as={Row} className="mb-3">
          <Form.Label column sm={1}>
            UID
          </Form.Label>
          <Col>
            <InputGroup>
              <Form.Control value={uid} onChange={onUidChange} />
              <Button
                variant="secondary"
                size="sm"
                onClick={getUidFromClipboard}
              >
                Paste From Clipboard
              </Button>
              {window.NDEFReader && <ScanButton setUid={setUid} />}
            </InputGroup>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col className="d-grid gap-2">
            <Button variant="primary" onClick={generate} size="lg">
              Generate
            </Button>
          </Col>
        </Form.Group>
        {url && (
          <Form.Group as={Row}>
            <Col>
              <InputGroup>
                <Form.Control value={url} readOnly />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copyUrlToClipboard}
                >
                  Copy To Clipboard
                </Button>
              </InputGroup>
            </Col>
          </Form.Group>
        )}
      </Form>
    </React.Fragment>
  );
}
