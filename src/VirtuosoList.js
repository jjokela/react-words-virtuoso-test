import { GroupedVirtuoso } from 'react-virtuoso'
import { getWords } from './data'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { clickChange$ } from "./state";

export default function VirtuosoList() {

    const { data, groups, groupCounts } = getWords();
    const [align, setAlign] = useState("start");
    const [behavior, setBehavior] = useState("auto");
    const virtuoso = useRef(null);

    useEffect(() => {
        clickChange$.subscribe((e) => {
            console.log('nappia painettu jea');
            console.log(e.target.textContent);

            // find the first index of the data, where the first letter of the word is the same as the clicked letter
            const index = data.findIndex((word) => word.word[0].toLowerCase() === e.target.textContent.toLowerCase());
            console.log(index);
            
            virtuoso.current.scrollToIndex({
                index: index,
                align,
                behavior
            });

        });
    });

    return (
        <div>
            <GroupedVirtuoso
                style={{ height: 800 }}
                ref={virtuoso}
                groupCounts={groupCounts}
                components={MUIComponents}
                groupContent={(index) => {
                    return <div>{groups[index].toUpperCase()}</div>
                }}
                itemContent={(index) => {
                    const word = data[index]
                    return (
                        <>
                            <ListItemText primary={word.word} secondary={<span>{JSON.parse(word.content)}</span>} />
                        </>
                    )
                }}
            />
        </div>
    )
}


const MUIComponents = {
    List: React.forwardRef(({ style, children }, listRef) => {
        return (
            <List style={{ padding: 0, ...style, margin: 0 }} component="div" ref={listRef}>
                {children}
            </List>
        )
    }),

    Item: ({ children, ...props }) => {
        return (
            <ListItem component="div" {...props} style={{ margin: 0 }}>
                {children}
            </ListItem>
        )
    },

    Group: ({ children, style, ...props }) => {
        return (
            <ListSubheader
                component="div"
                {...props}
                style={{
                    ...style,
                    backgroundColor: 'white',
                    margin: 0,
                }}
            >
                {children}
            </ListSubheader>
        )
    },
}
