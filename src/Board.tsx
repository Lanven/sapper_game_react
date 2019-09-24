import React, {Component} from "react";
import Cell from "./Cell";
import {connect} from "react-redux";

interface Props {
    dispatch: any,
    onContextMenu: string
}

interface MappedStateToProps {
    state: any,
    row: number,
    call: number
}

type ComponentProps = Partial<MappedStateToProps> & Props;

class Board extends Component <ComponentProps> {

    renderCell(row: any, call: any) {

        const isOpen: boolean = this.props.state.list[row][call].isOpen;
        const isFlag: boolean = this.props.state.list[row][call].isFlag;
        const isLastClick: boolean = this.props.state.list[row][call].isLastClick;
        const isBomb = this.props.state.bombsList ? (this.props.state.bombsList.indexOf(Math.round((row)*this.props.state.height + call + 1)) !== -1) : false;

        let changeCell = (button: number) => {
            if (button === 2 && !isOpen) {
                this.props.dispatch(
                    {
                        type: "CLICK_CELL_FLAG",
                        row: row,
                        call: call
                    }
                )
            }

            if (button === 0 && !isFlag && !isOpen) {
                this.props.dispatch(
                    {
                        type: "CLICK_CELL",
                        row: row,
                        call: call
                    }
                )
            }
        }

        let clickCellEvent = (event: MouseEvent) => {
            let button = event.button;

            if (!this.props.state.bombsList) {
                Promise.resolve(this.props.dispatch(
                    {
                        type: "FILL_BOARD",
                        row: row,
                        call: call
                    }
                )).then(
                    () => changeCell(button)
                )
            } else {
                changeCell(button);
            }

        };

        return <Cell
            value={this.props.state.list[row][call].value}
            isOpen={isOpen}
            isFlag={isFlag}
            isBomb={isBomb}
            isLastClick={isLastClick}
            onMouseDown={clickCellEvent}
        />
    }

    render() {
        const list: number[][] = this.props.state.list;

        return (
            <div>
                {
                    list.map((row, i) => (
                        <div key={i}>
                            {
                                row.map((col, j) => (
                                    this.renderCell(i, j)
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({state: state});
export default connect(mapStateToProps)(Board);