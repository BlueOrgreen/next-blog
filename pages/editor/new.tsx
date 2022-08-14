import type { NextPage } from 'next';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store/index';
import dynamic from "next/dynamic";
import { ChangeEvent, useState } from "react";
import { Input, Button, message } from 'antd';
import request from 'service/fetch';
import styles from './index.module.scss';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useRouter } from 'next/router';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const EditorNew: NextPage = () => {
  const store = useStore();
  const { push } = useRouter();
  const { userId } = store.user.userInfo;
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const handlePublish = () => {
    if(!title) {
      message.warning('请输入文章标题')
    } else {
      request.post('/api/article/publish', {
        title,
        content,
      }).then((res: any) => {
        if(res.code === 0) {
          userId ? push(`/user/${userId}`) : push('/');
          message.success('发布成功');
        } else {
          message.error(res.msg || '发布失败')
        }
      })
    }
  }

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target?.value)
  }

  const handleChangeContent = (content: any) => {
    setContent(content);
  }

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleChangeTitle} />
        <Button className={styles.btn} type="primary" onClick={handlePublish}>发布</Button>
      </div>
      <MDEditor value={content} onChange={handleChangeContent} height={1080} />
    </div>
  );
}

(EditorNew as any).layout = null;

export default observer(EditorNew);
