import Form from "antd/es/form/Form"
import Input from "antd/es/input/Input"
import { Content } from "antd/es/layout/layout"
import { Button, DatePicker, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Upload from "antd/es/upload/Upload";
import './form.css'
import TextArea from "antd/es/input/TextArea";

const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
const monthFormat = 'YYYY/MM'
function CUForm({inputs, handleSave, initialValues}) {
  return (
    <div className="content">
        <Content>
            <Form onFinish={handleSave} initialValues={initialValues} layout="vertical">
                {inputs.map((input, index) => (
                    <Form.Item
                        key={index}
                        label={input.label}
                        name={input.name}
                        rules={input.rules}
                    >
                        {input.isInput && <Input disabled={input.isDisabled} />}
                        {input.isTextArea && <TextArea rows={2} maxLength={3}/>}
                        {input.isSelect && 
                            <Select allowClear mode={input.mode} onChange={input.onChange}>
                                {input.options.map((option) => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        }
                        {input.isDate && <DatePicker/>}
                        {input.isMonth && <DatePicker format={monthFormat} picker="month"/>}
                        {input.isImg && 
                            <Upload action="/upload.do" listType="picture-card" getValueFromEvent={normFile}>
                                <button
                                    style={{
                                        border: 0,
                                        background: 'none',
                                    }}
                                    type="button"
                                >
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}
                                    >
                                        Upload image
                                    </div>
                                </button>
                            </Upload>
                        }
                    </Form.Item>
                    
                ))}
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="btn">Lưu</Button>
                </Form.Item>
            </Form>
        </Content>
    </div>
  )
}

export default CUForm