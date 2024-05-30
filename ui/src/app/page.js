"use client"

const repos = require('@/repos.json')

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { ArrowUpRightIcon, Clipboard } from 'lucide-react'
import Link from "next/link"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import { useState } from "react"

export default function Home() {
  // Order by latest tag, alpha release, and stars
  repos.sort((a, b) => a.latest_tag > b.latest_tag ? 1 : -1)
  repos.sort((a, b) => b.alpha_release ? -1 : 1)
  repos.sort((a, b) => b.stars - a.stars)

  repos.forEach(repo => {
    if (repo.packages) {
      repo.packages_order = Object.keys(repo.packages).sort((a, b) => a > b ? 1 : -1)
    }
  })

  let defaultPackages = {}
  repos.forEach(repo => {
    if (repo.packages) {
      defaultPackages[repo.go_package] = repo.packages[repo.packages_order[0]]
    }
  })

  const [selectedPackages, setSelectedPackages] = useState(defaultPackages)

  return (
    <div className="flex flex-col justify-between h-full w-[80%] mx-[10%]">
      <div>
        <div className="flex flex-col mx-4 mt-16 mb-12 smallscr:mx-0 smallscr:mt-8 smallscr:mb-6">
          <h1 className="text-3xl">go.nathanmartins.dev</h1>
          <h2 className="text-sm mt-1 text-muted-foreground">nathanmartins's Go Package Index</h2>
        </div>
        <div className="flex flex-row flex-wrap justify-start align-center smallscr:flex-col smallscr:items-center">
          {repos.map((repo, index) => (
            <Card key={index} className="w-[350px] m-4 flex flex-col justify-between smallscr:w-full smallscr:min-w-[316px] smallscr:my-2 smallscr:mx-0">
              <CardHeader>
                <CardTitle className="flex flex-row justify-between mb-2">
                  <Link href={"/" + repo.go_package} className="hover:underline">{repo.owner}/{repo.name}</Link>
                  <Badge variant="outline" className={cn("bg-opacity-10", repo.alpha_release ? "bg-red-500" : "bg-sky-500")}>
                    <div className="flex flex-row align-center text-muted-foreground">
                      <span className={cn("flex h-2 w-2 mr-2 translate-y-1 rounded-full", repo.alpha_release ? "bg-red-500" : "bg-sky-500")} />
                      <span>{repo.latest_tag}</span>
                    </div>
                  </Badge>
                </CardTitle>
                <CardDescription>{repo.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                {repo.has_cli_app && <div>
                  <Label className="text-xs">Install CLI App</Label>
                  <div className="flex flex-row items-center justify-between rounded-md border p-2 mt-2 mb-4 text-sm text-muted-foreground">
                    <span className="overflow-auto px-2 py-2 whitespace-nowrap">{`go install go.nathanmartins.dev/${repo.go_package}/cmd/${repo.go_package}@latest`}</span>
                    <Button
                      variant="outline" className="px-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`go install go.nathanmartins.dev/${repo.go_package}/cmd/${repo.go_package}@latest`)
                        toast("Copied to clipboard", {
                          description: "Run `go install` in terminal to install the " + repo.name + " CLI app."
                        })
                      }}
                    >
                      <Clipboard className="w-4" />
                    </Button>
                  </div>
                </div>}
                {repo.packages_order && <div>
                  <Label className="text-xs">Pull containers</Label>
                  <Select>
                    <SelectTrigger className="max-w-[300px] mt-2">
                      <SelectValue
                        placeholder={repo.packages_order[0]} defaultValue={repo.packages[repo.packages_order[0]]}
                        onSelect={value => {
                          console.log(`onSelect called for ${repo.go_package}: ${value}`)
                          setSelectedPackages({ ...selectedPackages, [repo.go_package]: repo.packages[value] })
                        }}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {/* <SelectLabel>Fruits</SelectLabel> */}
                        {repo.packages_order.map(pkg_name => <SelectItem key={pkg_name} value={pkg_name}>{pkg_name}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-row items-center justify-between rounded-md border p-2 mt-2 mb-4 text-sm text-muted-foreground">
                    <span className="overflow-auto px-2 py-2 whitespace-nowrap">{`docker pull ${selectedPackages[repo.go_package]}`}</span>
                    <Button
                      variant="outline" className="px-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`docker pull ${selectedPackages[repo.go_package]}`)
                        toast("Copied to clipboard", {
                          description: "Run `docker pull` in terminal to pull the container."
                        })
                      }}
                    >
                      <Clipboard className="w-4" />
                    </Button>
                  </div>
                </div>}
                <Label className="text-xs">Clone Repo</Label>
                <div className="flex flex-row items-center justify-between rounded-md border p-2 mt-2 text-sm text-muted-foreground">
                  <span className="overflow-auto px-2 py-2 whitespace-nowrap">{`github.com/${repo.owner}/${repo.name}.git`}</span>
                  <Button
                    variant="outline" className="px-2"
                    onClick={() => {
                      navigator.clipboard.writeText(`git clone https://github.com/${repo.owner}/${repo.name}.git`)
                      toast("Copied to clipboard", {
                        description: "Run `git clone` in terminal to clone the repository."
                      })
                    }}
                  >
                    <Clipboard className="w-4" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`https://pkg.go.dev/go.nathanmartins.dev/${repo.go_package}`} target="_blank" rel="noreferrer">
                  <Button variant="outline">
                    <span className="mr-2 font-light text-xs">pkg.go.dev</span>
                    <ArrowUpRightIcon size={16} />
                  </Button>
                </Link>
                <Link href={`https://github.com/${repo.owner}/${repo.name}`} target="_blank" rel="noreferrer">
                  <Button variant="outline">
                    <GitHubLogoIcon className="mr-1" />
                    <span className="mx-1 font-light text-xs">Star</span>
                    <Separator orientation="vertical" className="ml-1 mr-2 bg-white" />
                    <span className="ml-1 font-light text-xs">{repo.stars}</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex flex-row w-full align-center justify-center text-muted-foreground font-light text-xs pt-16 pb-10">
        <div className="flex flex-row align-center items-center hover:text-white">
          <GitHubLogoIcon className="w-6 h-6 mr-3 smallscr:hidden" />
          <span>This package index is open source.</span>
        </div>
        <Separator orientation="vertical" className="mx-5"/>
        <Link
          href="https://github.com/nathanmartins/go.nathanmartins.dev"
          target="_blank" rel="noreferrer"
          className="flex flex-row align-center items-center hover:text-white hover:underline"
        >
          <span className="mr-3">nathanmartins/go.nathanmartins.dev</span>
          <ArrowUpRightIcon size={20} />
        </Link>
      </div>
    </div>
  )
}
