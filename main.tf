module "package" {
  source  = "cloudventure-io/package/nodejs"
  version = "~> 2.0"

  files = [
    {
      path    = path.module
      include = ["src/*.js", "*.json", "LICENSE"]
      exclude = ["\\.test\\.js$"]
    },
  ]
}

output "name" {
  value = "fetch"
}

output "files" {
  value = module.package.files
}

output "version" {
  value = jsondecode(file("${path.module}/package.json")).version
}
