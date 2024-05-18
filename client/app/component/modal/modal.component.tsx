

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';


export interface ModalProps {
    open: boolean;
    handleClose: CallableFunction;
    handleSave: CallableFunction;
    scroll:  "body" | "paper" | undefined;
    children: React.ReactElement;
    title: string;
    saveBtnText?: string;
    cancelBtnText?: string;
}

export const ModalComponent = (props: ModalProps) => {

    const dialogCloseHandler = () => {
        props.handleClose();
    }

    const dialogSaveHandler = () => {
        props.handleSave();
    }

    return (
        <React.Fragment>
            <Dialog
                open={props.open}
                onClose={dialogCloseHandler}
                scroll={props.scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">{props.title}</DialogTitle>
                <DialogContent dividers={props.scroll === 'paper'}>
                    {props.children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={dialogCloseHandler}>{props.cancelBtnText || "Cancel"}</Button>
                    <Button onClick={dialogSaveHandler}>{props.saveBtnText || "Submit"}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
