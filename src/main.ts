#!/usr/bin/env node

enum EVENT {
  PR = "PullRequestEvent",
  IC = "IssueCommentEvent",
  P = "PushEvent",
  I = "IssuesEvent"
}

async function main(): Promise<void> {
  const arguments = process.argv.slice(2);

  if (arguments.length > 1) {
    console.log("Username must only contain one")
    return;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${arguments[0]}/events`, {
      method: "GET",
      headers: {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    })
    const data = await res.json()

    if (!data.length) {
      console.log("User not found or have no activities")

      return;
    }



    data.forEach(data => {

      if (data.type === EVENT.PR) {
        console.log(`Pulled Request in ${data.repo.name} status: ${data.payload.action}`)
      }
      else if (data.type === EVENT.IC) {
        console.log(`Commented to ${data.repo.name}`)
      } else if (data.type === EVENT.P) {
        console.log(`Pushed ${data.payload.size} commits in ${data.repo.name}`)
      }
      else if (data.type === EVENT.I) {
        console.log(`Opened a new issue in ${data.repo.name}`)
      }
    });


  } catch (err) {
    console.log("err", err)
  }
}



main()