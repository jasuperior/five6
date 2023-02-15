import { state } from "@oneii3/4iv";

export const or = (...choices: any[]) => {
    let result = state();
};

export const controlFlow = {};

/*
TODO how do we handle control flow?
!- does it have to be an element? can i figure out a clever way to do it wihtout an element(s)?


For lists:
- when the compoennt is rendering, dont flatten the children array at first. 
- use the array to detect the elements which may need to be replaced/added and where.


choice(()=> a > 21, someState, someElseState)
or(something, and(somethingelse, somethingthird), somethingother)
*/
