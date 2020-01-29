import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Table, TableBody, TableRow
} from 'semantic-ui-react'

import { createRekog, deleteRekog, getRekogs, patchRekog } from '../api/rekogs-api'
import Auth from '../auth/Auth'
import { RekogItem } from '../types/RekogItem'

interface RekogsProps {
  auth: Auth
  history: History
}

interface RekogsState {
  rekogs: RekogItem[]
  newRekogName: string
  loadingRekogs: boolean
}

export class Rekogs extends React.PureComponent<RekogsProps, RekogsState> {
  state: RekogsState = {
    rekogs: [],
    newRekogName: '',
    loadingRekogs: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRekogName: event.target.value })
  }

  onEditButtonClick = (rekogId: string) => {
    this.props.history.push(`/rekogs/${rekogId}/edit`)
  }

  onRekogCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      // const dueDate = this.calculateDueDate()
      const createdAt = new Date().toLocaleString();

      const newRekog = await createRekog(this.props.auth.getIdToken(), {
        rekogResults: [],
        userValidated: [],
        name: this.state.newRekogName,
        createdAt: createdAt
      })
      this.setState({
        rekogs: [...this.state.rekogs, newRekog],
        newRekogName: ''
      })
    } catch {
      alert('Rekog creation failed')
    }
  }

  onRekogDelete = async (rekogId: string) => {
    try {
      await deleteRekog(this.props.auth.getIdToken(), rekogId)
      this.setState({
        rekogs: this.state.rekogs.filter(rekog => rekog.rekogId != rekogId)
      })
    } catch {
      alert('Rekog deletion failed')
    }
  }

  onRekogCheck = async (pos: number, lineId: number) => {
    try {
      const rekog = this.state.rekogs[pos]
      const userValidated: Array<boolean> = rekog.userValidated;
      userValidated[lineId] = !userValidated[lineId];
      await patchRekog(
        this.props.auth.getIdToken(),
        rekog.rekogId, {
        name: rekog.name,
        userValidated: userValidated
      });

      this.setState((state) => {
        const newRekogs = state.rekogs;
        newRekogs[pos].userValidated = userValidated
        return({
            rekogs: newRekogs
          }
        )
      });

      this.forceUpdate();

    } catch {
      alert('Rekog change failed')
    }
  }


  async componentDidMount() {
    try {
      const rekogs = await getRekogs(this.props.auth.getIdToken())
      this.setState({
        rekogs: rekogs,
        loadingRekogs: false
      })
    } catch (e) {
      alert(`Failed to fetch rekogs: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Rekognition Tests</Header>

        {this.renderCreateRekogInput()}

        {this.renderRekogs()}
      </div>
    )
  }

  renderCreateRekogInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Rekognition',
              onClick: this.onRekogCreate
            }}
            fluid
            actionPosition="left"
            placeholder="What would you like to detect today?"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRekogs() {
    if (this.state.loadingRekogs) {
      return this.renderLoading()
    }

    return this.renderRekogsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Rekogs
        </Loader>
      </Grid.Row>
    )
  }

  renderRekogsList() {
    return (
        <Table>
        {
          this.state.rekogs.map((rekog, pos) => {

          return (
            <TableBody>
            <TableRow key={rekog.rekogId}>
              <Grid padded>
              <Grid.Row key={rekog.rekogId}>
                <Grid.Column width={10} verticalAlign="middle">
                  {rekog.name}
                </Grid.Column>
                <Grid.Column width={3} floated="right">
                  {rekog.createdAt}
                </Grid.Column>
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(rekog.rekogId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                </Grid.Column>
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onRekogDelete(rekog.rekogId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Grid.Column>
                {rekog.attachmentUrl && (
                  <Image src={rekog.attachmentUrl} size="small" wrapped />
                )}
              </Grid.Row>
              </Grid>
            </TableRow>
            <TableRow>
              {
                rekog.rekogResults.map(
                  (e, i) => {
                    return (
                      <Grid padded>
                        <Grid.Row>
                          <Grid.Column width={1} verticalAlign="middle" textAlign="left">
                            <Checkbox
                              onChange={async () => await this.onRekogCheck(pos, i)}
                              checked={rekog.userValidated[i]}
                            />
                          </Grid.Column>
                          <Grid.Column width={6} verticalAlign="middle">
                          {e}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                )
              })
              }
            </TableRow>
            <TableRow>
              <Grid.Column width={16}>
                <Divider/>
              </Grid.Column>
            </TableRow>
            </TableBody>

          )
        })}
        </Table>
    )
  }
}
