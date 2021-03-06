import ForgeUI, { render, ProjectPage, Fragment, Text, Button, useProductContext, useState } from '@forge/ui';
import api, { route } from '@forge/api';

const App = () => {

  const [response, setResponse] = useState("Click the Button");
  const context = useProductContext();

  const createIssue = async () => {

    const projectKey = context.platformContext.projectKey;

    const responseGetProject = await api.asApp().requestJira(route`/rest/api/3/project/${projectKey}?expand=issueTypes`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const jsonGetProject = await responseGetProject.json();

    const issueType = jsonGetProject.issueTypes.find(issueType => issueType.name == "Story");

    var bodyData = {
      "fields": {
        "summary": "Test",
        "project": {
          "key": projectKey
        },
        "issuetype": {
          "id": issueType.id
        },
        "description": {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "Test description",
                  "type": "text"
                }
              ]
            }
          ]
        },
        "labels": [
          "testlabel"
        ]
      }
    };

    const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });


    const json = await response.json();

    setResponse(JSON.stringify(json));
  };

  return (
    <Fragment>
      <Text>{response}</Text>
      <Button text="Create Issue" onClick={createIssue} />
    </Fragment>
  );
};

export const run = render(
  <ProjectPage>
    <App />
  </ProjectPage>
);
