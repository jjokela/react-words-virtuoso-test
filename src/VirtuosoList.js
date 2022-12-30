import { GroupedVirtuoso } from 'react-virtuoso'
import { getWords, getCheckedWords } from './data'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import React, { useState, useRef, useEffect } from 'react'
import { clickChange$, showAllChange$, showSelectedChange$, checkedCountChange$, setCheckedCount, useCheckedCount, checkedCount$ } from "./state";
import './VirtuosoList.css';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';

export default function VirtuosoList() {

    const [usersData, setUsers] = React.useState([]);
    const [groups, setGroups] = React.useState([]);
    const [groupCounts, setGroupCounts] = React.useState([]);

    const [align, setAlign] = useState("start");

    const [behavior, setBehavior] = useState("auto");
    const [checked, setChecked] = React.useState([]);

    const [checkedC, setCheckedC] = React.useState(0);

    const virtuoso = useRef(null);

    useEffect(() => {
        clickChange$.subscribe((e) => {
            console.log('nappia painettu jea');
            console.log(e.target.textContent);

            // find the first index of the data, where the first letter of the word is the same as the clicked letter
            const index = usersData.findIndex((word) => word.word[0].toLowerCase() === e.target.textContent.toLowerCase());
            console.log(index);

            virtuoso.current.scrollToIndex({
                index: index,
                align,
                behavior
            });

        });
    });

    // can't call react hook in a callback (checked state change function), so using the local state workaround
    useEffect(() => {
        checkedCount$.subscribe((value) => {
            console.log('checked count changed');
            setCheckedC(value);
        });
    });

    useEffect(() => {
        showAllChange$.subscribe((value) => {
            console.log('show all clicked');
            let { data, groupCounts, groups } = getWords();
            setGridStates(data, groups, groupCounts);
        });
    });

    useEffect(() => {
        showSelectedChange$.subscribe((value) => {
            console.log('show selected clicked');
            let { data, groupCounts, groups } = getCheckedWords(checked);
            setGridStates(data, groups, groupCounts);
        });
    });

    useEffect(() => {
        const items = localStorage.getItem('checked-items');
        const checkedItems = items ? items.split(',').map(Number) : [];

        console.log(checkedItems);
        if (checkedItems) {
            console.log('setting items');
            setChecked(checkedItems);
            setCheckedCount(checkedItems.length);
        }

        let { data, groupCounts, groups } = getWords();
        setGridStates(data, groups, groupCounts);
    }, []);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            // inc
            setCheckedCount(checkedC + 1);
        } else {
            newChecked.splice(currentIndex, 1);
            // dec
            setCheckedCount(checkedC - 1);
        }
        console.log(newChecked);
        setChecked(newChecked);

        localStorage.setItem('checked-items', newChecked);
    };

    const setGridStates = (data, groups, groupCounts) => {
        setUsers(data);
        setGroups(groups);
        setGroupCounts(groupCounts);
    };

    return (
        <div>
            <GroupedVirtuoso
                style={{ height: '90vh' }}
                ref={virtuoso}
                groupCounts={groupCounts}
                components={MUIComponents}
                groupContent={(index) => {
                    return <div style={{ fontWeight: 'bold' }}>{groups[index].toUpperCase()}</div>
                }}
                itemContent={(index) => {
                    const user = usersData[index];
                    const labelId = `checkbox-list-label-${user.index}`;
                    return (
                        <>
                            <ListItem
                                key={user.index}
                                disableGutters
                                secondaryAction={
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(user.index) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                        onChange={handleToggle(user.index)} 
                                    />
                                }
                                disablePadding
                            ><ListItemButton role={undefined} dense>
                                    <ListItemText id={1} primary={`${user.word}`} secondary={JSON.parse(user.content)} />
                                </ListItemButton>
                            </ListItem>
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
