resource "aws_security_group" "langfuse_db" {
  name        = "${local.prefix}-db-sg"
  description = "Access to Langfuse database"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.langfuse_worker.id, aws_security_group.langfuse_web.id]
    description     = "Allow PostgreSQL access from langfuse web and worker"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all traffic out to the internet"
  }

  tags = {
    Name = "langfuse_database_sg"
  }
}

resource "aws_security_group" "langfuse_cache" {
  vpc_id      = var.vpc_id
  name        = "${local.prefix}-cache-sg"
  description = "Langfuse Cache Security Group"
  tags = {
    Name = "langfuse_cache_sg"
  }

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.langfuse_db.id, aws_security_group.langfuse_worker.id, aws_security_group.langfuse_web.id]
    description     = "Ingress Allow all traffic from app and flower security groups"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Egress Allow all traffic"
  }
}

resource "aws_security_group" "langfuse_worker" {
  name   = "langfuse-worker-sg"
  vpc_id = var.vpc_id
  tags = {
    Name = "langfuse_worker_sg"
  }

  ingress {
    from_port       = 3030
    to_port         = 3030
    protocol        = "tcp"
    security_groups = [aws_security_group.langfuse_web.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "langfuse_web" {
  name   = "langfuse-web-sg"
  vpc_id = var.vpc_id
  tags = {
    Name = "langfuse_web_sg"
  }

  /*
  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
  }

*/
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "langfuse_web_lambda_ingress" {
  for_each = { for id in [aws_security_group.lb.id, var.lambda_security_group_id] : id => id if id != null }

  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.langfuse_web.id
  source_security_group_id = each.value
  description              = "Allow lambda monitor access to langfuse-web"
}

resource "aws_security_group" "clickhouse" {
  name   = "${local.prefix}-clickhouse-sg"
  vpc_id = var.vpc_id
  tags = {
    Name = "langfuse_clickhouse_sg"
  }

  ingress {
    from_port       = 8123
    to_port         = 8123
    protocol        = "tcp"
    security_groups = [aws_security_group.langfuse_web.id, aws_security_group.langfuse_worker.id]
  }

  ingress {
    from_port       = 9000
    to_port         = 9000
    protocol        = "tcp"
    security_groups = [aws_security_group.langfuse_web.id, aws_security_group.langfuse_worker.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "efs" {
  name        = "${local.prefix}-efs-clickhouse"
  description = "Allow EFS access from ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 2049
    to_port         = 2049
    protocol        = "tcp"
    security_groups = [aws_security_group.clickhouse.id]
  }
}

resource "aws_security_group" "lb" {
  name        = "${local.prefix}-lb-sg"
  description = "Ingress security group for Langfuse ALB"
  vpc_id      = var.vpc_id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "langfuse_lb_sg"
  }
}
