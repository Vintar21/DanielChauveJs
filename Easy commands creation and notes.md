# Easy commands creation

Possible solutions for simple command creation

## JSON

```
{
    "simpleCommands": [
        {
            "name": "hello world",
            // Maybe only string triggers for those
            "prefix:": "!" // "!" by default
            "triggers": ["hello", "hi"],
            "answers": ["Welcome", "Oh hi !"]
            "canReply": true // by default true
            ]
        },...
    ],
    "countersCommands": [

    ],...
}
```

## GSheet

Same idea but commands are now written in GSheet. It can replace a database and
handle counters more easily. We can provide a template to copy.

## In the code

Best practice = 1 file by command otherwise create a template for all kind of
commands in a dedicated TS file. The user need to modify it. It's easier for the
bot but require the user to code something even if it means copy/paste and
modify informations

## Other reflexions

If the bot is supposed to be always active (on a dedivated server for instance)
it will be harder to modify things locally like OBS. Can a websocket be accessed
thhrough network ?
